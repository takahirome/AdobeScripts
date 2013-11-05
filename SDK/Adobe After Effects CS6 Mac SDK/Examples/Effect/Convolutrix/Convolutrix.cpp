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

/*	Convolutrix.cpp	

	This sample exercises some of After Effects' image processing
	callback functions.

	Revision history: 

	1.0 Seemed like a good idea at the time.	bbb		2/20/02
	2.0 Moved to AEGP_SuiteHandler				bbb		2/20/05
	3.0 Added a boatload more callbacks,		bbb		6/1/06
		messed around with param set		

*/


#include "Convolutrix.h"

static PF_Err 
About (	
	PF_InData		*in_data,
	PF_OutData		*out_data)
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
	PF_OutData		*out_data)
{
	out_data->my_version = PF_VERSION(	MAJOR_VERSION, 
										MINOR_VERSION,
										BUG_VERSION, 
										STAGE_VERSION, 
										BUILD_VERSION);

	out_data->out_flags = 	PF_OutFlag_I_HAVE_EXTERNAL_DEPENDENCIES;
	out_data->out_flags2 =  PF_OutFlag2_PARAM_GROUP_START_COLLAPSED_FLAG;
	
	return PF_Err_NONE;
}

static PF_Err 
ParamsSetup (	
	PF_InData		*in_data,
	PF_OutData		*out_data)
{
	PF_Err		err		= PF_Err_NONE;
	PF_ParamDef	def;	

	AEFX_CLR_STRUCT(def);

	PF_ADD_FLOAT_SLIDER(STR(StrID_Amount_Param_Name), 
						CONVO_AMOUNT_MIN,
						CONVO_AMOUNT_MAX,
						CONVO_AMOUNT_MIN,
						CONVO_AMOUNT_MAX,
						CURVE_TOLERANCE,
						CONVO_AMOUNT_DFLT,
						2,
						PF_ValueDisplayFlag_PERCENT,
						FALSE,
						CONVO_AMOUNT_ID);
	
	AEFX_CLR_STRUCT(def);

	PF_ADD_TOPIC(STR(StrID_TopicName), CONVO_BLEND_GROUP_START_ID);
	
	AEFX_CLR_STRUCT(def);
	
	PF_ADD_FLOAT_SLIDER(STR(StrID_Blend_Amount_Param_Name), 
						CONVO_AMOUNT_MIN,
						CONVO_AMOUNT_MAX,
						CONVO_AMOUNT_MIN,
						CONVO_AMOUNT_MAX,
						CURVE_TOLERANCE,
						CONVO_AMOUNT_DFLT,
						2,
						PF_ValueDisplayFlag_PERCENT,
						FALSE,
						CONVO_BLEND_AMOUNT_ID);

	PF_ADD_COLOR(	STR(StrID_Color_Param_Name),
					PF_MAX_CHAN8,
					0,
					PF_MAX_CHAN8,
					COLOR_DISK_ID);
				 
	PF_END_TOPIC(CONVO_BLEND_GROUP_END_ID);
	
	out_data->num_params = CONVO_NUM_PARAMS;

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
	
	PF_Err			err				= 	PF_Err_NONE,
					err2			=	PF_Err_NONE;
	A_long			convKer[9]		=	{0};

	if (params[CONVO_AMOUNT]->u.fs_d.value) {	// we're doing some convolving...

		PF_Fixed		amount_as_fixed	=	FLOAT2FIX((params[CONVO_AMOUNT]->u.fs_d.value / 100));
		PF_FpLong		sharpen			= 	(1 + suites.ANSICallbacksSuite1()->ceil(amount_as_fixed) / 16.0),
		kernelSum						= 	PF_MAX_CHAN8 * 9;
		
		convKer[4]	= (A_long)(sharpen * kernelSum);
		kernelSum	= (PF_MAX_CHAN8 * 9 - convKer[4]) / 4;
		convKer[1]	= convKer[3] = convKer[5] = convKer[7] = (A_long)kernelSum;
		
		ERR(suites.WorldTransformSuite1()->convolve(	in_data->effect_ref,
														&params[CONVO_INPUT]->u.ld,
														&in_data->extent_hint,
														PF_KernelFlag_2D | PF_KernelFlag_CLAMP, 
														KERNEL_SIZE,
														convKer, 
														convKer, 
														convKer, 
														convKer, 
														output));

		if (params[CONVO_BLEND_COLOR_AMOUNT]->u.fs_d.value){ // we're blending in a color.
			
			//	Allocate a world full of the color to blend.
			
			PF_EffectWorld	temp;
			AEFX_CLR_STRUCT(temp);
			
			ERR(PF_NEW_WORLD(output->width,
							 output->height,
							 PF_NewWorldFlag_NONE,
							 &temp));
			
			ERR(PF_FILL(&params[CONVO_COLOR]->u.cd.value,
						NULL,
						&temp));
			
			ERR(PF_BLEND(output,
						 &temp,
						 FLOAT2FIX((params[CONVO_BLEND_COLOR_AMOUNT]->u.fs_d.value / 100.0)),
						 output));

			if (temp.data){			// if there's a data pointer, we allocated something
				ERR2(PF_DISPOSE_WORLD(&temp));
			}
		} 
		
	} else {	// No matter what, we populate the output buffer.
		if (PF_Quality_HI == in_data->quality) {
			
			ERR(suites.WorldTransformSuite1()->copy_hq(	 in_data->effect_ref,
														 &params[CONVO_INPUT]->u.ld, 
														 output, 
														 NULL, 
														 NULL));
		} else {
			ERR(suites.WorldTransformSuite1()->copy(	in_data->effect_ref,
														&params[CONVO_INPUT]->u.ld, 
														output, 
														NULL, 
														NULL));
		}  
	}
	return err;
}

static PF_Err		
DescribeDependencies(	
	PF_InData					*in_data,	
	PF_OutData					*out_data,	
	PF_ExtDependenciesExtra		*extraP)	
{
	PF_Err						err		= PF_Err_NONE;
	PF_Handle					msgH	= NULL;

	AEGP_SuiteHandler suites(in_data->pica_basicP);
	
	if (extraP) {
		switch (extraP->check_type) {

			case PF_DepCheckType_ALL_DEPENDENCIES:

				msgH = suites.HandleSuite1()->host_new_handle((A_long)strlen(STR(StrID_DependString1)) + 1);
				suites.ANSICallbacksSuite1()->strcpy(reinterpret_cast<char*>(DH(msgH)),STR(StrID_DependString1));
				break;

			case PF_DepCheckType_MISSING_DEPENDENCIES:
				
				// one-ninth of the time, something's missing
				if (rand() % 9)	{
					msgH = suites.HandleSuite1()->host_new_handle((A_long)strlen(STR(StrID_DependString2)) + 1);
					suites.ANSICallbacksSuite1()->strcpy(static_cast<A_char*>(DH(msgH)),STR(StrID_DependString2));
				}
				break;

			default:
				msgH = suites.HandleSuite1()->host_new_handle((A_long)strlen(STR(StrID_NONE)) + 1);
				suites.ANSICallbacksSuite1()->strcpy(static_cast<A_char*>(DH(msgH)),STR(StrID_NONE));
				break;

		}
		extraP->dependencies_strH = msgH;
	}
	return err;
}

DllExport	PF_Err 
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
				ERR(About(in_data, out_data));
				break;
			case PF_Cmd_GLOBAL_SETUP:
				ERR(GlobalSetup(out_data));
				break;
			case PF_Cmd_PARAMS_SETUP:
				ERR(ParamsSetup(in_data, out_data));
				break;
			case PF_Cmd_RENDER:
				ERR(Render(in_data, out_data, params, output));
				break;
			case PF_Cmd_GET_EXTERNAL_DEPENDENCIES:
				ERR(DescribeDependencies(in_data, out_data, reinterpret_cast<PF_ExtDependenciesExtra*>(extra)));
				break;
		}
	} catch(PF_Err &thrown_err) {
		err = thrown_err;
	}
	return err;
}
