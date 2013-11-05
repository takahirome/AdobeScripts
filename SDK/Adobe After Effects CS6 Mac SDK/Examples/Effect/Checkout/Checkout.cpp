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




#include "Checkout.h"


static PF_Err 
GlobalSetup (	
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output ) 
{
	PF_Err 	err = PF_Err_NONE;

	DuckSuite1*		dsP = NULL;

	if (AEFX_AcquireSuite(	in_data, 
							out_data, 
							kDuckSuite1, 
							kDuckSuiteVersion1, 
							"Couldn't load suite.",
							(void**)&dsP)) {
		PF_STRCPY(out_data->return_msg, "No Duck Suite! That's OK; check the Sweetie sample for details.");
	} else {
		if (dsP) {
			dsP->Quack(2);
 			ERR(AEFX_ReleaseSuite(	in_data, 
									out_data, 
									kDuckSuite1, 
									kDuckSuiteVersion1,
									"Couldn't release suite."));
		}
	} 

	out_data->my_version = PF_VERSION(	MAJOR_VERSION, 
										MINOR_VERSION,
										BUG_VERSION, 
										STAGE_VERSION, 
										BUILD_VERSION);

	out_data->out_flags = 	PF_OutFlag_WIDE_TIME_INPUT |
							PF_OutFlag_I_DO_DIALOG;
	
	return err;
}


static PF_Err 
ParamsSetup (
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	PF_Err			err = PF_Err_NONE;
	PF_ParamDef		def;	
	PF_EffectUISuite1	*effect_ui_suiteP = NULL;


	AEFX_CLR_STRUCT(def);
	
	PF_ADD_SLIDER(	NAME, 
					CHECK_FRAME_MIN, 
					CHECK_FRAME_MAX, 
					CHECK_FRAME_MIN, 
					CHECK_FRAME_MAX, 
					CHECK_FRAME_DFLT,
					CHECK_FRAME_DISK_ID);

	AEFX_CLR_STRUCT(def);

	PF_ADD_LAYER(	"Layer to checkout", 
					PF_LayerDefault_MYSELF, 
					CHECK_LAYER_DISK_ID);

	out_data->num_params = CHECK_NUM_PARAMS;
	
	// Premiere Pro/Elements does not support this suite
	if (in_data->appl_id != 'PrMr')
	{
		ERR(AEFX_AcquireSuite(	in_data,
								out_data,
								kPFEffectUISuite,
								kPFEffectUISuiteVersion1,
								NULL,
								(void**)&effect_ui_suiteP));

		ERR(effect_ui_suiteP->PF_SetOptionsButtonName(in_data->effect_ref, "Whatever I want!"));
		(void)AEFX_ReleaseSuite(in_data, 
								out_data, 
								kPFEffectUISuite, 
								kPFEffectUISuiteVersion1, 
								NULL);
	}
	return err;
}

 
static PF_Err 
Render(	
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	PF_Err				err 			= PF_Err_NONE,
						err2 			= PF_Err_NONE;
	int32_t				num_channelsL 	= 0;
	PF_Rect				halfsies		= {0,0,0,0};
	PF_ParamDef			checkout; 
	PF_ChannelSuite1	*csP			= NULL;
	PF_ChannelDesc		desc;
	PF_ChannelRef		ref;
	PF_ChannelChunk		chunk;
	PF_Boolean			found_depthPB;
	
	AEFX_CLR_STRUCT(checkout);
	
	// Premiere Pro/Elements does not support this suite
	if (in_data->appl_id != 'PrMr')
	{
		ERR(AEFX_AcquireSuite(	in_data, 
									out_data, 
									kPFChannelSuite1, 
									kPFChannelSuiteVersion1, 
									"Couldn't load suite.",
									(void**)&csP));
								
		ERR(csP->PF_GetLayerChannelCount(	in_data->effect_ref, 
											 0, 
											 &num_channelsL));
												 

		if(num_channelsL) {
			ERR(csP->PF_GetLayerChannelTypedRefAndDesc(	in_data->effect_ref,
														0,	
														PF_ChannelType_DEPTH,		
														&found_depthPB,		
														&ref,	
														&desc)); 

			ERR(csP->PF_CheckoutLayerChannel(	in_data->effect_ref,
												&ref,
												in_data->current_time,
												in_data->time_step,			
												in_data->time_scale,			
												desc.data_type,			
												&chunk));
												
			// do interesting 3d stuff here;
			
			ERR(csP->PF_CheckinLayerChannel(in_data->effect_ref,
											&ref,
											&chunk));
		}

		ERR2(AEFX_ReleaseSuite(	in_data, 
								out_data, 
								kPFChannelSuite1, 
								kPFChannelSuiteVersion1,
								"Couldn't release suite."));
	}

	// set the checked-out rect to be the top half of the layer 
	
	halfsies.top	= halfsies.left	= 0;
	halfsies.right	= (short)output->width;
	halfsies.bottom	= (short)(output->height / 2);
	
	ERR(PF_CHECKOUT_PARAM(	in_data, 
							CHECK_LAYER,
							(in_data->current_time + params[CHECK_FRAME]->u.sd.value * in_data->time_step), 
							in_data->time_step,
							in_data->time_scale, 
							&checkout));
							
	if (!err) {
		if (checkout.u.ld.data)  {
			ERR(PF_COPY(&checkout.u.ld, 
						output, 
						NULL, 
						&halfsies));
		}  else  {
			// no layer? Zero-alpha black.
			ERR(PF_FILL(NULL, &halfsies, output));		
		}
	
		if (!err)  {
			halfsies.top		= halfsies.bottom;				//reset rect, copy.
			halfsies.bottom 	= (short)output->height;

			ERR(PF_COPY(&params[CHECK_INPUT]->u.ld, 
						output, 
						NULL, 
						&halfsies));
		}
	}

	ERR2(PF_CHECKIN_PARAM(in_data, &checkout));		// ALWAYS check in,
													// even if invalid param.
	return err;
}


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
PopDialog (	
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	PF_Err err = PF_Err_NONE;

	PF_SPRINTF(	out_data->return_msg, 
				"This would be a fine place for\ra platform-specific options dialog.");
	out_data->out_flags |= PF_OutFlag_DISPLAY_ERROR_MESSAGE;
	
 	return err;
}

DllExport	
PF_Err 
EntryPointFunc (	
	PF_Cmd			cmd,
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	PF_Err		err = PF_Err_NONE;

	switch (cmd) {
		case PF_Cmd_ABOUT:
			err = About(in_data,out_data,params,output);
			break;		
		case PF_Cmd_GLOBAL_SETUP:
			err = GlobalSetup(in_data,out_data,params,output);
			break;
		case PF_Cmd_PARAMS_SETUP:
			err = ParamsSetup(in_data,out_data,params,output);
			break;
		case PF_Cmd_RENDER:
			err = Render(in_data,out_data,params,output);
			break;
		case PF_Cmd_DO_DIALOG:
			err = PopDialog(in_data,out_data,params,output);
			break;		
		default:
			break;
	}
	return err;
}

