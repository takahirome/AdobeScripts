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
	SDK_Noise.cpp
	
	A simple noise algorithm.
	
	Revision History
		
	Version		Change										Engineer	Date
	=======		======										========	======
	1.0			created										eks			8/31/99

	1.1			moved to C++, overhauled					bbb			10/10/01
	
	2.0 		changed to AEGP_SuiteHandler				bbb			3/1/03
 
	3.0			Float-ification, in preparation				bbb			7/1/06
				for Smart-ification

*/

#include "SDK_Noise.h"


static PF_Err 
About (	
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	PF_SPRINTF(	out_data->return_msg, 
				"%s, v%d.%d\r%s",
				NAME, 
				MAJOR_VERSION, 
				MINOR_VERSION, 
				DESCRIPTION);

	return PF_Err_NONE;
}

static PF_Err 
GlobalSetup (
	PF_InData		*in_dataP,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	PF_Err	err				= PF_Err_NONE;

	out_data->my_version	= PF_VERSION(	MAJOR_VERSION, 
											MINOR_VERSION,
											BUG_VERSION, 
											STAGE_VERSION, 
											BUILD_VERSION);
	
	out_data->out_flags		=	PF_OutFlag_PIX_INDEPENDENT	|
								PF_OutFlag_DEEP_COLOR_AWARE |
								PF_OutFlag_NON_PARAM_VARY;

	out_data->out_flags2	=	PF_OutFlag2_FLOAT_COLOR_AWARE	|
								PF_OutFlag2_SUPPORTS_SMART_RENDER;

	if (in_dataP->appl_id == 'PrMr'){
		// For Premiere - declare supported pixel formats
		PF_PixelFormatSuite1* pixelFormatSuite = NULL;
		
		AEFX_AcquireSuite(
						  in_dataP,
						  out_data,
						  kPFPixelFormatSuite,
						  kPFPixelFormatSuiteVersion1,
						  NULL,
						  (void**)&pixelFormatSuite);
		
		if (pixelFormatSuite)
		{
			//	Add the pixel formats we support in order of preference.
			(*pixelFormatSuite->ClearSupportedPixelFormats)(in_dataP->effect_ref);	
			(*pixelFormatSuite->AddSupportedPixelFormat)(
														 in_dataP->effect_ref,
														 PrPixelFormat_VUYA_4444_32f);
			(*pixelFormatSuite->AddSupportedPixelFormat)(
														 in_dataP->effect_ref,
														 PrPixelFormat_BGRA_4444_32f);	
			(*pixelFormatSuite->AddSupportedPixelFormat)(
														 in_dataP->effect_ref,
														 PrPixelFormat_VUYA_4444_8u);
			(*pixelFormatSuite->AddSupportedPixelFormat)(
														 in_dataP->effect_ref,
														 PrPixelFormat_BGRA_4444_8u);	
			
			AEFX_ReleaseSuite(
							  in_dataP,
							  out_data,
							  kPFPixelFormatSuite,
							  kPFPixelFormatSuiteVersion1,
							  NULL);
		}
	}
	return err;
}

static PF_Err 
ParamsSetup (
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output)
{
	PF_Err			err = PF_Err_NONE;
	PF_ParamDef		def;
	
	AEFX_CLR_STRUCT(def);
	
	PF_ADD_FLOAT_SLIDERX("Noise variation", 
						FILTER_NOISE_MIN,
						FILTER_NOISE_MAX,
						SLIDER_MIN,
						SLIDER_MAX,
						FILTER_NOISE_DFLT,
						SLIDER_PRECISION,
						DISPLAY_FLAGS,
						0,
						SLIDER_DISK_ID);
	
	out_data->num_params = NOISE_NUM_PARAMS;

	return err;
}

static PF_Err 
FilterImage8 (
	void		*refcon, 
	A_long		xL, 
	A_long		yL, 
	PF_Pixel8	*inP, 
	PF_Pixel8	*outP)
{
	PF_Err			err = PF_Err_NONE;
	
	NoiseInfo *	niP		= reinterpret_cast<NoiseInfo*>(refcon);
	PF_FpLong	tempF		= 0;
					
	if (niP){
		tempF 	= rand() % PF_MAX_CHAN8;
		tempF	*= (niP->valF / SLIDER_MAX);

		outP->alpha		=	inP->alpha;
		outP->red		=	MIN(PF_MAX_CHAN8, inP->red + (A_u_char) tempF);
		outP->green		=	MIN(PF_MAX_CHAN8, inP->green + (A_u_char) tempF);
		outP->blue		=	MIN(PF_MAX_CHAN8, inP->blue + (A_u_char) tempF);
	}
	return err;
}

static PF_Err 
FilterImageBGRA_8u (
	void		*refcon, 
	A_long		xL, 
	A_long		yL, 
	PF_Pixel8	*inP, 
	PF_Pixel8	*outP)
{
	PF_Err			err = PF_Err_NONE;

	PF_Pixel_BGRA_8u *inBGRA_8uP, *outBGRA_8uP;
	inBGRA_8uP = reinterpret_cast<PF_Pixel_BGRA_8u*>(inP);
	outBGRA_8uP = reinterpret_cast<PF_Pixel_BGRA_8u*>(outP);

	NoiseInfo *	niP		= reinterpret_cast<NoiseInfo*>(refcon);
	PF_FpLong	tempF		= 0;
					
	if (niP){
		tempF 	= rand() % PF_MAX_CHAN8;
		tempF	*= (niP->valF / SLIDER_MAX);

		outBGRA_8uP->alpha		=	inBGRA_8uP->alpha;
		outBGRA_8uP->red		=	MIN(PF_MAX_CHAN8, inBGRA_8uP->red + (A_u_char) tempF);
		outBGRA_8uP->green		=	MIN(PF_MAX_CHAN8, inBGRA_8uP->green + (A_u_char) tempF);
		outBGRA_8uP->blue		=	MIN(PF_MAX_CHAN8, inBGRA_8uP->blue + (A_u_char) tempF);
	}
	return err;
}

static PF_Err 
FilterImageVUYA_8u (
	void		*refcon,
	A_long		xL, 
	A_long		yL, 
	PF_Pixel8	*inP, 
	PF_Pixel8	*outP)
{
	PF_Err			err = PF_Err_NONE;

	PF_Pixel_VUYA_8u *inVUYA_8uP, *outVUYA_8uP;
	inVUYA_8uP = reinterpret_cast<PF_Pixel_VUYA_8u*>(inP);
	outVUYA_8uP = reinterpret_cast<PF_Pixel_VUYA_8u*>(outP);

	NoiseInfo *	niP		= reinterpret_cast<NoiseInfo*>(refcon);
	PF_FpLong	tempF		= 0;
					
	if (niP){
		tempF 	= rand() % PF_MAX_CHAN8;
		tempF	*= (niP->valF / SLIDER_MAX);

		outVUYA_8uP->alpha		=	inVUYA_8uP->alpha;
		outVUYA_8uP->luma		=	MIN(PF_MAX_CHAN8, inVUYA_8uP->luma + (A_u_char) tempF);
		outVUYA_8uP->Pb			=	inVUYA_8uP->Pb;
		outVUYA_8uP->Pr			=	inVUYA_8uP->Pr;
	}
	return err;
}

static PF_Err 
FilterImage16 (
	 void		*refcon,
	 A_long		xL, 
	 A_long		yL, 
	 PF_Pixel16	*inP, 
	 PF_Pixel16	*outP)
{
	PF_Err			err = PF_Err_NONE;
	
	NoiseInfo *	niP		= reinterpret_cast<NoiseInfo*>(refcon);
	PF_FpLong	tempF	= 0;
	
	if (niP){
		tempF 	= rand() % PF_MAX_CHAN16;
		tempF	*= (niP->valF / SLIDER_MAX);
		
		outP->alpha		=	inP->alpha;
		outP->red		=	MIN(PF_MAX_CHAN16, inP->red + (A_u_short) tempF);
		outP->green		=	MIN(PF_MAX_CHAN16, inP->green + (A_u_short) tempF);
		outP->blue		=	MIN(PF_MAX_CHAN16, inP->blue + (A_u_short) tempF);
	}
	return err;
}

static PF_Err 
FilterImage32 (
	 void			*refcon,
	 A_long			xL, 
	 A_long			yL, 
	 PF_PixelFloat	*inP, 
	 PF_PixelFloat	*outP)
{
	PF_Err			err = PF_Err_NONE;
	
	NoiseInfo *	niP		= reinterpret_cast<NoiseInfo*>(refcon);
	PF_FpShort	tempF	= 0;
	
	if (niP){
		tempF 	= (PF_FpShort)(rand() % PF_MAX_CHAN16);
		tempF	*= (PF_FpShort)(niP->valF / (SLIDER_MAX * PF_MAX_CHAN16));
		
		outP->alpha		=	inP->alpha;
		outP->red		=	(inP->red	+ tempF);
		outP->green		=	(inP->green	+ tempF);
		outP->blue		=	(inP->blue	+ tempF);
	}
	return err;
}

static PF_Err 
FilterImageBGRA_32f (
	 void			*refcon, 
	 A_long			xL, 
	 A_long			yL, 
	 PF_PixelFloat	*inP, 
	 PF_PixelFloat	*outP)
{
	PF_Err			err = PF_Err_NONE;

	PF_Pixel_BGRA_32f *inBGRA_32fP, *outBGRA_32fP;
	inBGRA_32fP = reinterpret_cast<PF_Pixel_BGRA_32f*>(inP);
	outBGRA_32fP = reinterpret_cast<PF_Pixel_BGRA_32f*>(outP);
	
	NoiseInfo *	niP		= reinterpret_cast<NoiseInfo*>(refcon);
	PF_FpShort	tempF	= 0;
	
	if (niP){
		tempF 	= (PF_FpShort)(rand() % PF_MAX_CHAN16);
		tempF	*= (PF_FpShort)(niP->valF / (SLIDER_MAX * PF_MAX_CHAN16));
		
		outBGRA_32fP->alpha		=	inBGRA_32fP->alpha;
		outBGRA_32fP->red		=	(inBGRA_32fP->red + tempF);
		outBGRA_32fP->green		=	(inBGRA_32fP->green	+ tempF);
		outBGRA_32fP->blue		=	(inBGRA_32fP->blue + tempF);
	}
	return err;
}

static PF_Err 
FilterImageVUYA_32f (
	 void			*refcon,
	 A_long			xL, 
	 A_long			yL, 
	 PF_PixelFloat	*inP, 
	 PF_PixelFloat	*outP)
{
	PF_Err			err = PF_Err_NONE;

	PF_Pixel_VUYA_32f *inVUYA_32fP, *outVUYA_32fP;
	inVUYA_32fP = reinterpret_cast<PF_Pixel_VUYA_32f*>(inP);
	outVUYA_32fP = reinterpret_cast<PF_Pixel_VUYA_32f*>(outP);
	
	NoiseInfo *	niP		= reinterpret_cast<NoiseInfo*>(refcon);
	PF_FpShort	tempF	= 0;
	
	if (niP){
		tempF 	= (PF_FpShort)(rand() % PF_MAX_CHAN16);
		tempF	*= (PF_FpShort)(niP->valF / (SLIDER_MAX * PF_MAX_CHAN16));
		
		outVUYA_32fP->alpha		=	inVUYA_32fP->alpha;
		outVUYA_32fP->luma		=	(inVUYA_32fP->luma + tempF);
		outVUYA_32fP->Pb		=	inVUYA_32fP->Pb;
		outVUYA_32fP->Pr		=	inVUYA_32fP->Pr;
	}
	return err;
}

static PF_Err
IterateFloat (
	PF_InData			*in_data,
	long				progress_base,
	long				progress_final,
	PF_EffectWorld		*src,
	void				*refcon,
	PF_Err				(*pix_fn)(void *refcon, A_long x, A_long y, PF_PixelFloat *in, PF_PixelFloat *out),
	PF_EffectWorld		*dst)
{
	PF_Err	err		= PF_Err_NONE;
	char	*localSrc, *localDst;
	localSrc = reinterpret_cast<char*>(src->data);
	localDst = reinterpret_cast<char*>(dst->data);

	for (int y = progress_base; y < progress_final; y++)
	{
		for (int x = 0; x < in_data->width; x++)
		{
			pix_fn(refcon,
					0,
					0,
					reinterpret_cast<PF_PixelFloat*>(localSrc),
					reinterpret_cast<PF_PixelFloat*>(localDst));
			localSrc += 16;
			localDst += 16;
		}
		localSrc += (src->rowbytes - in_data->width * 16);
		localDst += (dst->rowbytes - in_data->width * 16);
	}

	return err;
}
 
static PF_Err 
Render ( 
	PF_InData		*in_dataP,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	PF_Err				err		= PF_Err_NONE;

	NoiseInfo			niP;
	A_long				linesL	= 0;
	
	AEFX_CLR_STRUCT(niP);
	
	linesL 		= output->extent_hint.bottom - output->extent_hint.top;
	niP.valF 	= params[NOISE_SLIDER]->u.fs_d.value;

	AEGP_SuiteHandler suites(in_dataP->pica_basicP);

	// Do high-bit depth rendering in Premiere Pro
	if (in_dataP->appl_id == 'PrMr') {

		// Get the Premiere pixel format suite
		PF_PixelFormatSuite1* pixelFormatSuite = NULL;

		err = AEFX_AcquireSuite(
			in_dataP,
			out_data,
			kPFPixelFormatSuite,
			kPFPixelFormatSuiteVersion1,
			NULL,
			(void**)&pixelFormatSuite);

		PrPixelFormat destinationPixelFormat = PrPixelFormat_BGRA_4444_8u;

		if (pixelFormatSuite) {
			(*pixelFormatSuite->GetPixelFormat)(output, &destinationPixelFormat);

			if (destinationPixelFormat == PrPixelFormat_BGRA_4444_8u){

				ERR(suites.Iterate8Suite1()->iterate(	in_dataP,
														0,								// progress base
														linesL,							// progress final
														&params[NOISE_INPUT]->u.ld,		// src 
														NULL,							// area - null for all pixels
														(void*)&niP,					// refcon - your custom data pointer
														FilterImageBGRA_8u,				// pixel function pointer
														output));	

			} else if (destinationPixelFormat == PrPixelFormat_VUYA_4444_8u){

				ERR(suites.Iterate8Suite1()->iterate(	in_dataP,
														0,								// progress base
														linesL,							// progress final
														&params[NOISE_INPUT]->u.ld,		// src 
														NULL,							// area - null for all pixels
														(void*)&niP,					// refcon - your custom data pointer
														FilterImageVUYA_8u,				// pixel function pointer
														output));

			} else if (destinationPixelFormat == PrPixelFormat_BGRA_4444_32f) {

				// Premiere doesn't support IterateFloatSuite1, so we've rolled our own
				IterateFloat(	in_dataP,
								0,								// progress base
								linesL,							// progress final
								&params[NOISE_INPUT]->u.ld,		// src 
								(void*)&niP,					// refcon - your custom data pointer
								FilterImageBGRA_32f,			// pixel function pointer
								output);	

			} else if (destinationPixelFormat == PrPixelFormat_VUYA_4444_32f) {

				// Premiere doesn't support IterateFloatSuite1, so we've rolled our own
				IterateFloat(	in_dataP,
								0,								// progress base
								linesL,							// progress final
								&params[NOISE_INPUT]->u.ld,		// src 
								(void*)&niP,					// refcon - your custom data pointer
								FilterImageVUYA_32f,			// pixel function pointer
								output);	

			} else {
				//	Return error, because we don't know how to handle the specified pixel type
				return PF_Err_UNRECOGNIZED_PARAM_TYPE;
			}

			err = AEFX_ReleaseSuite (
				in_dataP,
				out_data,
				kPFPixelFormatSuite,
				kPFPixelFormatSuiteVersion1,
				NULL);
		}

	} else if(params[NOISE_SLIDER]->u.fs_d.value != 0.0) {

		ERR(suites.Iterate8Suite1()->iterate(	in_dataP,
												0,								// progress base
												linesL,							// progress final
												&params[NOISE_INPUT]->u.ld,		// src 
												NULL,							// area - null for all pixels
												(void*)&niP,					// refcon - your custom data pointer
												FilterImage8,					// pixel function pointer
												output));						// dest
	} else {
		ERR(suites.WorldTransformSuite1()->copy(in_dataP->effect_ref,			// This effect ref (unique id)
												&params[NOISE_INPUT]->u.ld,		// Source
												output,							// Dest
												NULL,							// Source rect - null for all pixels
												NULL));							// Dest rect - null for all pixels
	}
	return err;
}

static PF_Err
PreRender(
	PF_InData			*in_dataP,
	PF_OutData			*out_dataP,
	PF_PreRenderExtra	*extraP)
{
	PF_Err err = PF_Err_NONE;
	PF_ParamDef noise_param;
	PF_RenderRequest req = extraP->input->output_request;
	PF_CheckoutResult in_result;
	AEGP_SuiteHandler suites(in_dataP->pica_basicP);
	
	AEFX_CLR_STRUCT(noise_param);

	PF_Handle	infoH	=	suites.HandleSuite1()->host_new_handle(sizeof(NoiseInfo));
	
	if (infoH){

		NoiseInfo	*infoP = reinterpret_cast<NoiseInfo*>(suites.HandleSuite1()->host_lock_handle(infoH));
		
		if (infoP){

			extraP->output->pre_render_data = infoH;
			
			ERR(PF_CHECKOUT_PARAM(	in_dataP, 
									NOISE_SLIDER, 
									in_dataP->current_time, 
									in_dataP->time_step, 
									in_dataP->time_scale, 
									&noise_param));
			
			if (!err){
				infoP->valF = noise_param.u.fs_d.value;
			}
			
			ERR(extraP->cb->checkout_layer(	in_dataP->effect_ref,
											NOISE_INPUT,
											NOISE_INPUT,
											&req,
											in_dataP->current_time,
											in_dataP->time_step,
											in_dataP->time_scale,
											&in_result));
			
			UnionLRect(&in_result.result_rect, 		&extraP->output->result_rect);
			UnionLRect(&in_result.max_result_rect, 	&extraP->output->max_result_rect);		
			suites.HandleSuite1()->host_unlock_handle(infoH);
		}
	} else {
		err = PF_Err_OUT_OF_MEMORY;
	}
	return err;
}

static PF_Err
SmartRender(
	PF_InData				*in_data,
	PF_OutData				*out_data,
	PF_SmartRenderExtra		*extraP)
{
	
	PF_Err			err		= PF_Err_NONE,
					err2 	= PF_Err_NONE;
	
	PF_EffectWorld	*input_worldP	= NULL, 
					*output_worldP  = NULL;

	AEGP_SuiteHandler suites(in_data->pica_basicP);
	
	NoiseInfo	*infoP = reinterpret_cast<NoiseInfo*>(suites.HandleSuite1()->host_lock_handle(reinterpret_cast<PF_Handle>(extraP->input->pre_render_data)));
	
	if (infoP){
		ERR((extraP->cb->checkout_layer_pixels(	in_data->effect_ref, NOISE_INPUT, &input_worldP)));
		ERR(extraP->cb->checkout_output(in_data->effect_ref, &output_worldP));
		
		PF_PixelFormat		format	=	PF_PixelFormat_INVALID;
		PF_WorldSuite2		*wsP	=	NULL;
		
		ERR(AEFX_AcquireSuite(	in_data, 
								out_data, 
								kPFWorldSuite, 
								kPFWorldSuiteVersion2, 
								"Couldn't load suite.",
								(void**)&wsP));
		
		if (infoP->valF == 0.0) {
			err = PF_COPY(input_worldP, output_worldP, NULL, NULL);
		} else {
			ERR(wsP->PF_GetPixelFormat(input_worldP, &format));
			
			if (!err){
				switch (format) {
					
					case PF_PixelFormat_ARGB128:
						
						ERR(suites.IterateFloatSuite1()->iterate(	in_data,
																	0,
																	output_worldP->height,
																	input_worldP,
																	NULL,
																	(void*)infoP,
																	FilterImage32,
																	output_worldP));
						break;
						
					case PF_PixelFormat_ARGB64:
						
						ERR(suites.Iterate16Suite1()->iterate(	in_data,
																0,
																output_worldP->height,
																input_worldP,
																NULL,
																(void*)infoP,
																FilterImage16,
																output_worldP));
						break;
						
					case PF_PixelFormat_ARGB32:
						
						
						ERR(suites.Iterate8Suite1()->iterate(	in_data,
																0,
																output_worldP->height,
																input_worldP,
																NULL,
																(void*)infoP,
																FilterImage8,
																output_worldP));
						break;
						
					default:
						err = PF_Err_BAD_CALLBACK_PARAM;
						break;
				}
			}		
		}
		ERR2(AEFX_ReleaseSuite(	in_data,
								out_data,
								kPFWorldSuite, 
								kPFWorldSuiteVersion2, 
								"Couldn't release suite."));
		ERR2(extraP->cb->checkin_layer_pixels(in_data->effect_ref, NOISE_INPUT));
	}
	return err;
	
}

PF_Err 
EntryPointFunc (
	PF_Cmd			cmd,
	PF_InData		*in_dataP,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output,
	void			*extra)
{
	PF_Err		err = PF_Err_NONE;
	
	switch (cmd) 
	{
		case PF_Cmd_ABOUT:
			err = About(in_dataP,out_data,params,output);
			break;
		case PF_Cmd_GLOBAL_SETUP:
			err = GlobalSetup(in_dataP,out_data,params,output);
			break;
		case PF_Cmd_PARAMS_SETUP:
			err = ParamsSetup(in_dataP,out_data,params,output);
			break;
		case PF_Cmd_RENDER:
			err = Render(in_dataP,out_data,params,output);
			break;
		case PF_Cmd_SMART_PRE_RENDER:
			err = PreRender(in_dataP, out_data, (PF_PreRenderExtra*)extra);
			break;
		case PF_Cmd_SMART_RENDER:
			err = SmartRender(in_dataP, out_data, (PF_SmartRenderExtra*)extra);
			break;
	}
	return err;
}
