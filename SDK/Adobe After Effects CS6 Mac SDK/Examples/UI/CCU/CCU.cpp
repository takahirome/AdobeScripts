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

/*
	CCU.cpp
	
	Part of the Adobe After Effects 8.0 SDK.
	Copyright 2007 Adobe Systems Incorporated.
	All Rights Reserved.
	
	Revision History

		1.0, 	created 							dmw		(lost in the mists of time...)
		2.0		ported to C++						bbb		3/20/02
		2.5		cleanup, PAR & downsample support	zal		8/25/09
		3.0		ported to Drawbot					zal		2/05/10
*/

#include "CCU.h"


static PF_Err 
About (	
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output)
{
	AEGP_SuiteHandler suites(in_data->pica_basicP);

	suites.ANSICallbacksSuite1()->sprintf(out_data->return_msg,
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
	PF_LayerDef		*output)
{
	out_data->my_version = PF_VERSION(	MAJOR_VERSION, 
										MINOR_VERSION,
										BUG_VERSION, 
										STAGE_VERSION, 
										BUILD_VERSION);

	out_data->out_flags |=	PF_OutFlag_USE_OUTPUT_EXTENT 	|
							PF_OutFlag_PIX_INDEPENDENT 		|
							PF_OutFlag_CUSTOM_UI;

	return PF_Err_NONE;
}

static PF_Err 
ParamsSetup (	
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output)
{
	PF_Err 			err = PF_Err_NONE;
	PF_ParamDef		def;
	
	AEFX_CLR_STRUCT(def);

	PF_ADD_FIXED(	STR(StrID_X_Slider_Name), 
					CCU_RADIUS_MIN, 
					CCU_RADIUS_BIG_MAX, 
					CCU_RADIUS_MIN, 
					CCU_RADIUS_MAX, 
					CCU_RADIUS_DFLT, 
					SLIDER_PRECISION, 
					DISPLAY_FLAGS,
					0,
					X_SLIDER_DISK_ID);

	AEFX_CLR_STRUCT(def);
	
	PF_ADD_FIXED(	STR(StrID_Y_Slider_Name), 
					CCU_RADIUS_MIN, 
					CCU_RADIUS_BIG_MAX, 
					CCU_RADIUS_MIN, 
					CCU_RADIUS_MAX, 
					CCU_RADIUS_DFLT, 
					SLIDER_PRECISION, 
					DISPLAY_FLAGS,
					0,
					Y_SLIDER_DISK_ID);

	AEFX_CLR_STRUCT(def);

	PF_ADD_POINT(	STR(StrID_Center_Name), 
					CCU_PTX_DFLT, 
					CCU_PTY_DFLT, 
					RESTRICT_BOUNDS,
					CENTER_DISK_ID);

	AEFX_CLR_STRUCT(def);	

	if (!err) 
	{
		PF_CustomUIInfo			ci;
		
		AEFX_CLR_STRUCT(ci);
		
		ci.events				=	PF_CustomEFlag_LAYER | 
									PF_CustomEFlag_COMP;
 		ci.comp_ui_width		= 
		ci.comp_ui_height		=	0;
		
		ci.comp_ui_alignment	=	PF_UIAlignment_NONE;
		
		ci.layer_ui_width		= 
		ci.layer_ui_height		=	0;
		
		ci.layer_ui_alignment	=	PF_UIAlignment_NONE;
		
		ci.preview_ui_width		=	
		ci.preview_ui_height	=	0;
		
		ci.layer_ui_alignment	=	PF_UIAlignment_NONE;

		err = (*(in_data->inter.register_ui))(in_data->effect_ref, &ci);
	}
	
	out_data->num_params		= CCU_NUM_PARAMS;
	
	return err;
}

static PF_Err 
Render (
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*outputP)
{
	PF_Err 				err = PF_Err_NONE;

	AEGP_SuiteHandler	suites(in_data->pica_basicP);

	PF_EffectWorld		*inputP 		= &params[0]->u.ld;

	A_long				min_xL			= 	outputP->extent_hint.left, 
						max_xL			= 	outputP->extent_hint.right, 
						min_yL			= 	outputP->extent_hint.top, 
						max_yL			= 	outputP->extent_hint.bottom,
						in_gutterL		= 	(inputP->rowbytes / sizeof(PF_Pixel8)) - inputP->width,
						out_gutterL		=	(outputP->rowbytes / sizeof(PF_Pixel8)) - outputP->width;

	PF_Pixel8			*bop_outP		= 	outputP->data,
						*bop_inP		= 	inputP->data;
											
	PF_FpLong			rad_xF			= 	FIX_2_FLOAT(params[CCU_X_RADIUS]->u.fd.value), 
						rad_yF			= 	FIX_2_FLOAT(params[CCU_Y_RADIUS]->u.fd.value),
						rad_x_sqrF		=	rad_xF * rad_xF,
						rad_y_sqrF		=	rad_yF * rad_yF,
						center_xF		= 	FIX_2_FLOAT(params[CCU_PT]->u.td.x_value), 
						center_yF		= 	FIX_2_FLOAT(params[CCU_PT]->u.td.y_value), 	
						dxF				=	0, 
						dyF				=	0, 
						dx_sqrF			=	0,
						dy_sqrF			=	0,
						parF			=	static_cast<float>(in_data->pixel_aspect_ratio.num) / in_data->pixel_aspect_ratio.den,
						downsample_x_invF =	static_cast<float>(in_data->downsample_x.den) / in_data->downsample_x.num,
						downsample_y_invF =	static_cast<float>(in_data->downsample_y.den) / in_data->downsample_y.num;

	// If either width or height is 0, just copy the entire frame from input to output
	
	if (rad_xF == 0 || rad_yF == 0) {

		// Premiere Pro/Elements doesn't support WorldTransformSuite1,
		// but it does support many of the callbacks in utils

		if (in_data->appl_id != 'PrMr') {
			if (PF_Quality_HI == in_data->quality){
				return suites.WorldTransformSuite1()->copy_hq(	in_data->effect_ref,
																&params[0]->u.ld, 
																outputP, 
																NULL, 
																NULL);
			} else{
				return suites.WorldTransformSuite1()->copy(	in_data->effect_ref,
															&params[0]->u.ld, 
															outputP, 
															NULL, 
															NULL);
			}
		} else {
			ERR(PF_COPY(&params[0]->u.ld,
						outputP,
						NULL,
						NULL));
		}

	} else {

		// Otherwise, loop through, row by row

		for (register A_long yL = 0; yL < outputP->height ; yL++) {

			dyF		= 	static_cast<PF_FpLong>(yL - center_yF);
			dyF		*=	downsample_y_invF;
			dy_sqrF	= 	dyF * dyF;

			// If the row will not be touched by the effect, copy the row from input to output

			if (dyF > rad_yF 	|| 
				dyF < -rad_yF 	|| 
				yL < min_yL 	|| 
				yL > max_yL) {
				
				for (register A_long xL = outputP->width; xL > 0; xL--)	{
					*bop_outP++ = *bop_inP++;
				}
					
			} else {
				for (register A_long xL = 0; xL < inputP->width; xL++) {
					dxF = xL - center_xF;
					dxF *= downsample_x_invF;
					dxF *= parF;
					dx_sqrF = dxF * dxF;

					// If the pixel is out of the visible x range covered by the circle 

					if (dxF > rad_xF || dxF < -rad_xF || xL < min_xL || xL > max_xL) {
						*bop_outP++ = *bop_inP++;
					} else {

						// An ellipse centered at (0,0) has the equation:
						// x^2 / a^2 + y^2 / b^2 = 1, where a is the width and b is the height of the ellipse
						// If the pixel is outside the ellipse's radius, just copy the source
						
						if (dx_sqrF / rad_x_sqrF + dy_sqrF / rad_y_sqrF >= 1) {
							*bop_outP++ = *bop_inP++;
						} else {
							bop_outP->alpha = 	bop_inP->alpha;
							bop_outP->green	=	PF_MAX_CHAN8;
							bop_outP->blue 	= 	0;
							bop_outP->red 	= 	0;
							bop_inP++;	
							bop_outP++;
						}
					}
				}
			}

			// At the end of each row, account for the gutter
			// (this number can vary by platform and for other reasons)
			
			if (yL >= 0 && yL < inputP->height){
				bop_inP	+= in_gutterL;
			}
		
			bop_outP += out_gutterL;

			// Check for interrupt!
			if ((yL) && (err = PF_PROGRESS(in_data, yL + 1, outputP->height))){
				return err;
			}
		} 
	}
	return err;
}

PF_Err DllExport 
EntryPointFunc (
				PF_Cmd			cmd,
				PF_InData		*in_data,
				PF_OutData		*out_data,
				PF_ParamDef		*params[],
				PF_LayerDef		*output,
				void			*extraPV)
{
	PF_Err		err = PF_Err_NONE;
	
	try {
		switch (cmd) 
		{
			case PF_Cmd_ABOUT:
				
				err =	About(	in_data,
								out_data,
								params,
								output);
				break;
				
			case PF_Cmd_GLOBAL_SETUP:
				
				err =	GlobalSetup(in_data,
									out_data,
									params,
									output);
				break;
				
			case PF_Cmd_PARAMS_SETUP:
				
				err =	ParamsSetup(in_data,
									out_data,
									params,
									output);
				break;
				
			case PF_Cmd_RENDER:
				
				err =	Render(	in_data,
								out_data,
								params,
								output);
				break;
				
			case PF_Cmd_EVENT:
				
				err =	HandleEvent(in_data,
									out_data,
									params,
									output,
									reinterpret_cast<PF_EventExtra*>(extraPV));
				break;
		}
	}
	catch(PF_Err &thrown_err){
		err = PF_Err_BAD_CALLBACK_PARAM;
	}
	return err;
}

