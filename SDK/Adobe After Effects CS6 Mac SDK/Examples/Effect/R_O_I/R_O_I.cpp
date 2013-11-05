/*******************************************************************/
/*                                                                 */
/*                      ADOBE CONFIDENTIAL                         */
/*                   _ _ _ _ _ _ _ _ _ _ _ _ _                     */
/*                                                                 */
/* Copyright 2007 Adobe Systems Incorporated                       */
/* All Rights Reserved.                                            */
/*                                                                 */
/* NOTICE:  All information contained herein is, and remains the   */
/* property of Adobe Systems Incorporated and its suppliers, if    */
/* any.  The intellectual and technical concepts contained         */
/* herein are proprietary to Adobe Systems Incorporated and its    */
/* suppliers and may be covered by U.S. and Foreign Patents,       */
/* patents in process, and are protected by trade secret or        */
/* copyright law.  Dissemination of this information or            */
/* reproduction of this material is strictly forbidden unless      */
/* prior written permission is obtained from Adobe Systems         */
/* Incorporated.                                                   */
/*                                                                 */
/*******************************************************************/

/*	R_O_I.cpp	

	This sample is a SmartFX-ified version of Convolutrix, which
	started live exercising some of After Effects' image processing
	callback functions.

	Revision history: 

	1.0 Get Smarterer!							bbb		1/24/06


*/


#include "R_O_I.h"

static
PF_Boolean IsEmptyRect(const PF_LRect *r){
	return (r->left >= r->right) || (r->top >= r->bottom);
}

static
void UnionLRect(const PF_LRect *src, PF_LRect *dst)
{
	if (IsEmptyRect(dst)) {
		*dst = *src;
	} else if (!IsEmptyRect(src)) {
		dst->left 	= mmin(dst->left, src->left);
		dst->top  	= mmin(dst->top, src->top);
		dst->right 	= mmax(dst->right, src->right);
		dst->bottom = mmax(dst->bottom, src->bottom);
	}
}



static PF_Err 
About (	
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	AEGP_SuiteHandler suites(in_data->pica_basicP);
	
	suites.ANSICallbacksSuite1()->sprintf(	out_data->return_msg,
											"%s v%d.%d\r%s",
											STR(StrID_Name), 
											MAJOR_VERSION, 
											MINOR_VERSION, 
											STR(StrID_Description));
	return PF_Err_NONE;
}

static PF_Err 
GlobalSetup (	
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	out_data->my_version = PF_VERSION(	MAJOR_VERSION, 
										MINOR_VERSION,
										BUG_VERSION, 
										STAGE_VERSION, 
										BUILD_VERSION);

	out_data->out_flags = 	PF_OutFlag_DEEP_COLOR_AWARE				 |
							PF_OutFlag_I_EXPAND_BUFFER;

	out_data->out_flags2 =  PF_OutFlag2_SUPPORTS_SMART_RENDER				|
							PF_OutFlag2_FLOAT_COLOR_AWARE					|
							PF_OutFlag2_PARAM_GROUP_START_COLLAPSED_FLAG	|
							PF_OutFlag2_SUPPORTS_QUERY_DYNAMIC_FLAGS;
	
	return PF_Err_NONE;
}

static PF_Err 
ParamsSetup (	
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	PF_Err		err		= PF_Err_NONE;
	PF_ParamDef	def;	

	AEFX_CLR_STRUCT(def);

	PF_ADD_POPUP(	STR(StrID_Popup_Param_Name),
					NUM_POPUP_CHOICES,
					NEW_SKOOL,
					STR(StrID_Popup_Choices),
					POPUP_DISK_ID);
					
	AEFX_CLR_STRUCT(def);

	PF_ADD_FLOAT_SLIDER(STR(StrID_Name), 
						ROI_AMOUNT_MIN, 
						ROI_AMOUNT_MAX, 
						ROI_AMOUNT_MIN, 
						ROI_AMOUNT_MAX,
						0, 
						ROI_AMOUNT_DFLT,
						2,
						PF_ValueDisplayFlag_PERCENT,
						FALSE,
						AMOUNT_DISK_ID);

	AEFX_CLR_STRUCT(def);

	PF_ADD_FLOAT_SLIDER(STR(StrID_Rect_Size_Param_Name), 
						ROI_AMOUNT_MIN, 
						ROI_SIZE_MAX, 
						ROI_AMOUNT_MIN, 
						ROI_SIZE_MAX,
						0, 
						ROI_AMOUNT_DFLT,
						0,
						PF_ValueDisplayFlag_NONE,
						FALSE,
						SIZE_DISK_ID);
	
	AEFX_CLR_STRUCT(def);

	PF_ADD_CHECKBOX(STR(StrID_Checkbox_Param_Name), 
					STR(StrID_Checkbox_Description), 
					TRUE,
					PF_ValueDisplayFlag_NONE, 
					DOWNSAMPLE_DISK_ID);

	AEFX_CLR_STRUCT(def);

	PF_ADD_COLOR(	STR(StrID_Color_Param_Name),
					0,
					PF_HALF_CHAN8,
					PF_MAX_CHAN8,
					COLOR_DISK_ID);
				 
	out_data->num_params = ROI_NUM_PARAMS;

	return err;
}

static PF_Err
PreRender(
	PF_InData				*in_data,
	PF_OutData				*out_data,
	PF_PreRenderExtra		*extra)
{
	PF_Err err = PF_Err_NONE;
	PF_ParamDef channel_param, ROI_area;
	PF_RenderRequest req = extra->input->output_request;
	PF_CheckoutResult in_result;

	AEFX_CLR_STRUCT(channel_param);
	AEFX_CLR_STRUCT(ROI_area);

	
	//	In order to know whether we care about alpha
	//	or not, we check out our channel pull-down
	//	(the old-fashioned way); if it's set to alpha,
	//	we care. 			-bbb 10/4/05.
	
	ERR(PF_CHECKOUT_PARAM(	in_data, 
							ROI_MODE, 
							in_data->current_time, 
							in_data->time_step, 
							in_data->time_scale, 
							&channel_param));

	ERR(PF_CHECKOUT_PARAM(	in_data, 
							ROI_SIZE, 
							in_data->current_time, 
							in_data->time_step, 
							in_data->time_scale, 
							&ROI_area));

	extra->output->pre_render_data = new ROI_RenderInfo(); 

	ROI_RenderInfo *infoP = reinterpret_cast<ROI_RenderInfo*>(extra->output->pre_render_data);
	
	if (!infoP){
		err = PF_Err_OUT_OF_MEMORY;
	} else {
		if (channel_param.u.pd.value == IGNORE_ALPHA){
			req.channel_mask &=  ~PF_ChannelMask_ALPHA;	
			req.preserve_rgb_of_zero_alpha = infoP->we_care_about_alphaB = FALSE;	// Chained assignment: I feel unwholesome...
		} else {
			req.preserve_rgb_of_zero_alpha = infoP->we_care_about_alphaB = TRUE;
		}

		ERR(extra->cb->checkout_layer(	in_data->effect_ref,
										ROI_INPUT,
										ROI_INPUT,
										&req,
										in_data->current_time,
										in_data->time_step,
										in_data->time_scale,
										&in_result));
		
		A_long in_result_widthL = abs(in_result.result_rect.right - in_result.result_rect.left),
				in_result_heightL = abs(in_result.result_rect.bottom - in_result.result_rect.top);

		infoP->rectR.top 	= ((in_result_heightL / 2) - (ROI_area.u.fs_d.value / 2));
		infoP->rectR.bottom = ((in_result_heightL / 2) + (ROI_area.u.fs_d.value / 2));
		infoP->rectR.left 	= ((in_result_widthL / 2) - (ROI_area.u.fs_d.value / 2));
		infoP->rectR.right 	= ((in_result_widthL / 2) + (ROI_area.u.fs_d.value / 2));

		UnionLRect(&infoP->rectR, 	&extra->output->result_rect);
		UnionLRect(&infoP->rectR, 	&extra->output->max_result_rect);	
	}	
	//	Notice something missing, namely the PF_CHECKIN_PARAM to balance
	//	the old-fashioned PF_CHECKOUT_PARAM, above? 
	
	//	For SmartFX, AE automagically checks in any params checked out 
	//	during PF_Cmd_SMART_PRE_RENDER, new or old-fashioned.
	
	return err;
}

static PF_Err
MungePixel8(
	A_long 		refcon, 
	A_long 		x, 
	A_long 		y, 
	PF_Pixel 	*in, 
	PF_Pixel 	*out)
{
	PF_Err err = PF_Err_NONE;
	ROI_RenderInfo *infoP = reinterpret_cast<ROI_RenderInfo*>(refcon);
	if (!infoP){
		err = PF_Err_INTERNAL_STRUCT_DAMAGED;
	} else {
		if (IsEdgePixel(&infoP->rectR, x, y)) {
			out->blue  =
			out->red   = 0;
			out->green = PF_MAX_CHAN8;
		} else {
			out->red = A_u_char(in->red + (infoP->color.red * PF_MAX_CHAN8) / 2);
			out->blue = A_u_char(in->blue + (infoP->color.blue * PF_MAX_CHAN8) / 2);
			out->green = A_u_char(in->green + (infoP->color.green * PF_MAX_CHAN8) / 2);
		}
		if (infoP->we_care_about_alphaB){
			out->alpha = A_u_char(in->alpha + (infoP->color.alpha * PF_MAX_CHAN8) / 2);
		} else {
			out->alpha = in->alpha;
		}

	}
	return err;
}

static PF_Err
MungePixel16(
	A_long		refcon, 
	A_long 		x, 
	A_long 		y, 
	PF_Pixel16 	*in, 
	PF_Pixel16 	*out)
{
	PF_Err err = PF_Err_NONE;
	ROI_RenderInfo *infoP = reinterpret_cast<ROI_RenderInfo*>(refcon);
	if (!infoP){
		err = PF_Err_INTERNAL_STRUCT_DAMAGED;
	} else {
		
	}
	return err;
}

static PF_Err
MungePixel32(
	A_long			refcon, 
	A_long 			x, 
	A_long 			y, 
	PF_PixelFloat 	*in, 
	PF_PixelFloat 	*out)
{
	PF_Err err = PF_Err_NONE;
	ROI_RenderInfo *infoP = reinterpret_cast<ROI_RenderInfo*>(refcon);
	if (!infoP){
		err = PF_Err_INTERNAL_STRUCT_DAMAGED;
	} else {
		
	}
	return err;
}


static PF_Err
SmartRender(
	PF_InData				*in_data,
	PF_OutData				*out_data,
	PF_SmartRenderExtra		*extra)

{

	PF_Err				err		= PF_Err_NONE,
						err2 	= PF_Err_NONE;

	PF_Point			origin;
	PF_PixelFormat		format			= PF_PixelFormat_INVALID;
	PF_WorldSuite2		*wsP			= NULL;
	PF_EffectWorld 		*input_worldP 	= NULL, 
						*output_worldP	= NULL;
						
	PF_Rect				iter_rectR;

	ROI_RenderInfo		info;
	
	PF_ParamDef 		ROI_mode, 
						ROI_amount, 
						ROI_area, 
						ROI_downsample, 
						ROI_color;
	
	AEGP_SuiteHandler suites(in_data->pica_basicP);

	AEFX_CLR_STRUCT(ROI_amount);

	ERR(AEFX_AcquireSuite(	in_data, 
							out_data, 
							kPFWorldSuite, 
							kPFWorldSuiteVersion2, 
							"Couldn't load suite.",
							(void**)&wsP));
	
	// checkout input & output buffers.
	ERR(extra->cb->checkout_layer_pixels(	in_data->effect_ref, ROI_INPUT, &input_worldP));

	ERR(extra->cb->checkout_output(	in_data->effect_ref, &output_worldP));

	// checkout the params of interest.
	ERR(PF_CHECKOUT_PARAM(	in_data, 
							ROI_AMOUNT, 
							in_data->current_time, 
							in_data->time_step, 
							in_data->time_scale, 
							&ROI_amount));

	if (ROI_amount.u.fs_d.value == 0.0){
		ERR(PF_COPY(input_worldP, output_worldP, NULL, NULL));
	} else {
		//	Wash thoroughly before first use.
		
		AEFX_CLR_STRUCT(ROI_mode);
		AEFX_CLR_STRUCT(ROI_area);
		AEFX_CLR_STRUCT(ROI_downsample);
		AEFX_CLR_STRUCT(ROI_color);
		AEFX_CLR_STRUCT(info);
		

		
		ERR(PF_CHECKOUT_PARAM(	in_data, 
								ROI_DOWNSAMPLE, 
								in_data->current_time, 
								in_data->time_step, 
								in_data->time_scale, 
								&ROI_downsample));
		
		ERR(PF_CHECKOUT_PARAM(	in_data, 
								ROI_COLOR, 
								in_data->current_time, 
								in_data->time_step, 
								in_data->time_scale, 
								&ROI_color));
		
		info.amountF				= ROI_amount.u.fs_d.value;
		info.we_care_about_alphaB 	= *(static_cast<A_Boolean*>(extra->input->pre_render_data));
		
		origin.h = in_data->output_origin_x;
		origin.v = in_data->output_origin_y;

		info.rectR.top 		= iter_rectR.top 		= ((input_worldP->height / 2) - (ROI_area.u.fs_d.value / 2));
		info.rectR.bottom 	= iter_rectR.bottom 	= ((input_worldP->height / 2) + (ROI_area.u.fs_d.value / 2));
		info.rectR.left 	= iter_rectR.left 		= ((input_worldP->width / 2) - (ROI_area.u.fs_d.value / 2));
		info.rectR.right 	= iter_rectR.right 		= ((input_worldP->width / 2) + (ROI_area.u.fs_d.value / 2));

		ERR(suites.ColorParamSuite1()->PF_GetFloatingPointColorFromColorDef(in_data->effect_ref, &ROI_color, &info.color));

		ERR(wsP->PF_GetPixelFormat(input_worldP, &format));
	

		switch (format) {
		
			case PF_PixelFormat_ARGB128:
			
				ERR(suites.IterateFloatSuite1()->iterate_origin(in_data,
																0,
																output_worldP->height,
																output_worldP,
																(PF_Rect*)&extra->input->output_request.rect,
																&origin,
																(A_long)&info,
																MungePixel32,
																output_worldP));
				break;
				
			case PF_PixelFormat_ARGB64:
		
				ERR(suites.Iterate16Suite1()->iterate_origin(	in_data,
																0,
																output_worldP->height,
																output_worldP,
																(PF_Rect*)&extra->input->output_request.rect,
																&origin,
																(A_long)&info,
																MungePixel16,
																output_worldP));
				break;
				
			case PF_PixelFormat_ARGB32:
			
				ERR(suites.Iterate8Suite1()->iterate_origin(	in_data,
																0,
																output_worldP->height,
																output_worldP,
																(PF_Rect*)&extra->input->output_request.rect,
																&origin,
																(A_long)&info,
																MungePixel8,
																output_worldP));
				break;

			default:
				err = PF_Err_BAD_CALLBACK_PARAM;
				break;
		}
	}
	ERR2(AEFX_ReleaseSuite(	in_data,
							out_data,
							kPFWorldSuite, 
							kPFWorldSuiteVersion2, 
							"Couldn't release suite."));
												
	// Always check in, no matter what the error condition!
	
	ERR2(PF_CHECKIN_PARAM(in_data, &ROI_mode));
	ERR2(PF_CHECKIN_PARAM(in_data, &ROI_amount));
	ERR2(PF_CHECKIN_PARAM(in_data, &ROI_area));
	ERR2(PF_CHECKIN_PARAM(in_data, &ROI_downsample));
	ERR2(PF_CHECKIN_PARAM(in_data, &ROI_color));

	return err;
  
}

static PF_Err
Render(
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output)
{
	AEGP_SuiteHandler	suites(in_data->pica_basicP);
	
	PF_Err			err			= 	PF_Err_NONE;
	A_long			convKer[9] 	= 	{0};

	PF_FpLong		sharpen 	= 	suites.ANSICallbacksSuite1()->ceil(params[ROI_AMOUNT]->u.sd.value / 16),
					kernelSum 	= 	PF_MAX_CHAN8 * 9;

	PF_Boolean		no_opB		=	FALSE;
	
		

	if (params[ROI_AMOUNT]->u.sd.value == 0) {
		no_opB	=	TRUE;
		
		if (PF_Quality_HI == in_data->quality) {
			err = suites.WorldTransformSuite1()->copy_hq(in_data->effect_ref,
														&params[0]->u.ld, 
														output, 
														NULL, 
														NULL);
		} else {
			err = suites.WorldTransformSuite1()->copy(	in_data->effect_ref,
														&params[0]->u.ld, 
														output, 
														NULL, 
														NULL);
		}
	}

	convKer[4]	= (A_long)(sharpen * kernelSum);
	kernelSum	= (PF_MAX_CHAN8 * 9 - convKer[4]) / 4;
	convKer[1]	= convKer[3] = convKer[5] = convKer[7] = (A_long)kernelSum;

	if (!no_opB){
		ERR(suites.WorldTransformSuite1()->convolve(	in_data->effect_ref,
														&params[0]->u.ld, 
														&in_data->extent_hint,
														PF_KernelFlag_2D | PF_KernelFlag_CLAMP, 
														KERNEL_SIZE,
														convKer, 
														convKer, 
														convKer, 
														convKer, 
														output));
	}
	return err;
}

DllExport	
PF_Err 
EntryPointFunc (	
	PF_Cmd			cmd,
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output,
	void			*extra)
{
	PF_Err		err = PF_Err_NONE;
	
	try {
		switch (cmd) {
			case PF_Cmd_ABOUT:
				err = About(in_data, out_data, params, output);
				break;

			case PF_Cmd_GLOBAL_SETUP:
				err = GlobalSetup(in_data, out_data, params, output);
				break;

			case PF_Cmd_PARAMS_SETUP:
				err = ParamsSetup(in_data, out_data, params, output);
				break;

			case PF_Cmd_RENDER:
				err = Render(in_data, out_data, params, output);
				break;
				
			case PF_Cmd_QUERY_DYNAMIC_FLAGS:
				break;
				
			case PF_Cmd_SMART_PRE_RENDER:
				err = PreRender(in_data, out_data, reinterpret_cast<PF_PreRenderExtra*>(extra));
				break;

			case PF_Cmd_SMART_RENDER:
				err = SmartRender(in_data, out_data, reinterpret_cast<PF_SmartRenderExtra*>(extra));
				break;
		}
	} catch(PF_Err &thrown_err) {
		err = thrown_err;
	}
	return err;
}
