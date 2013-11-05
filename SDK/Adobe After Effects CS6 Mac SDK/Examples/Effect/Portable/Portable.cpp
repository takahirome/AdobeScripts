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
	Portable.cpp

	This sample demonstrates how to detect (and, to a slight extent, respond to) different hosts.
	
	Revision History

	Version		Change													Engineer	Date
	=======		======													========	======
		1.0		Created for use in Premiere AE API support testing 		bbb
		2.0		Put on some weight. In a good way.						bbb
		3.0		Removed redundant code already in Gamma Table sample.	zal			8/15/2011
		
*/

#include "Portable.h"

// Check the host app and version number in in_data
// Return an appropriate message in out_data

static PF_Err
DetectHost (
	PF_InData		*in_data,
	PF_OutData		*out_data)
{
	PF_Err err = PF_Err_NONE;

	switch (in_data->appl_id){

		case 'FXTC':
			if (in_data->version.major >= 12)
			{
				if (in_data->version.major == 13 && in_data->version.minor >= 2) {
					PF_SPRINTF(out_data->return_msg, "Running in After Effects CS6 or later.");

				} else if (in_data->version.major == 13 && in_data->version.minor == 1) {
					PF_SPRINTF(out_data->return_msg, "Running in After Effects CS5.5.");

				} else if (in_data->version.major == 13 && in_data->version.minor >= 0) {
					PF_SPRINTF(out_data->return_msg, "Running in After Effects CS5.");

				} 
				else {
					
					//	Q. How can I tell the difference between AE 6.5 and 7.0?
					
					//	A. The effect API didn't change the only way to differentiate
					//	between them is to check for the presence of a version of a 
					//	suite new in 7.0. Say, something 32bpc-ish. To avoid AEGP_SuiteHandler
					//	throwing if	the suite isn't present, we'll acquire it the old-school way.
					
					PF_iterateFloatSuite1 *ifsP = NULL;
					
					PF_Err just_checking_err = AEFX_AcquireSuite(	in_data, 
																	out_data, 
																	kPFIterateFloatSuite, 
																	kPFIterateFloatSuiteVersion1, 
																	NULL, 
																	reinterpret_cast<void**>(&ifsP));
					if (!just_checking_err){
						if (!ifsP){
							PF_SPRINTF(out_data->return_msg, "Running in After Effects 6.5 or earlier.");
						} else {
							PF_SPRINTF(out_data->return_msg, "Running in After Effects between 7.0 and CS4.");
						}

						//	Thanks, you have your suite back...
						
						just_checking_err = AEFX_ReleaseSuite(in_data, 
															  out_data, 
															  kPFIterateFloatSuite, 
															  kPFIterateFloatSuiteVersion1,
															  NULL);
					}
				}
			} else {	// Wow, an antique!
				
				//	DisplayWarningAboutUsingPluginInOldHost();
				//	SuggestUpgradingAESoYourPluginGetsNewAPIFeatures();
				PF_SPRINTF(out_data->return_msg, "Hey, some unknown version of After Effects!");

			} 
			break;
		
		case 'PrMr':
			{
				// The major/minor versions provide basic differentiation.
				// If you need finer granularity, e.g. differentiating between
				// PPro 5.0.0 and 5.0.2, then use the App Info Suite from
				// the Premiere Pro SDK
				if (in_data->version.major == 13 && in_data->version.minor >= 2) {
					PF_SPRINTF(out_data->return_msg, "Hey, Premiere Pro CS6 or later!");

				} else if (in_data->version.major == 13 && in_data->version.minor == 1) {
					PF_SPRINTF(out_data->return_msg, "Hey, Premiere Pro CS5.5!");

				} else if (in_data->version.major == 13 && in_data->version.minor == 0) {
					PF_SPRINTF(out_data->return_msg, "Hey, Premiere Pro CS5 or Premiere Elements 9!");

				} else if (in_data->version.major == 12 && in_data->version.minor == 5)	{
					PF_SPRINTF(out_data->return_msg, "Hey, Premiere Pro CS4 or Premiere Elements 8!");

				} else if (in_data->version.major == 12 && in_data->version.minor == 4)	{
					PF_SPRINTF(out_data->return_msg, "Hey, Premiere Pro CS3 or Premiere Elements 4 or 7!");

				} else if (in_data->version.major == 12 && in_data->version.minor == 3) {
					PF_SPRINTF(out_data->return_msg, "Hey, Premiere Pro 2.0 or Premiere Elements 3.0!");

				} else if (in_data->version.major == 12 && in_data->version.minor == 2)	{
					PF_SPRINTF(out_data->return_msg, "Hey, Premiere Pro 1.5 or Premiere Elements 2.0!");

				} else if (in_data->version.major == 12 && in_data->version.minor == 1)	{
					PF_SPRINTF(out_data->return_msg, "Hey, Premiere Pro 1.0 or Premiere Elements 1.0!");

				} else if (in_data->version.major == 12 && in_data->version.minor > 4) {
					PF_SPRINTF(out_data->return_msg, "Hey, some new version of Premiere!");

				} else {
					PF_SPRINTF(out_data->return_msg, "Hey, some unknown version of Premiere!");
				}
			}
			break;

		case 'KeyG':
			PF_SPRINTF(out_data->return_msg, "Hey, Final Cut! Neat.");
			break;

		case 'Cbst':
			PF_SPRINTF(out_data->return_msg, "Hey, Combustion! Neat.");
			//	Many thanks to developer Robert Graf robert@goofers.org,
			//	for saving me the trouble of rigging up a Combustion-based
			//	debugging session just to find the appl_id.
			//						-bbb 07/13/06
			break;
			
		default:
			PF_SPRINTF(out_data->return_msg, "Wow, we're running in some oddball host.");
			break;
	}

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
	PF_Err		err					= PF_Err_NONE;

	out_data->my_version = PF_VERSION(	MAJOR_VERSION, 
										MINOR_VERSION,
										BUG_VERSION, 
										STAGE_VERSION, 
										BUILD_VERSION);
	
	out_data->out_flags |=	PF_OutFlag_PIX_INDEPENDENT |
							PF_OutFlag_USE_OUTPUT_EXTENT;

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
	AEFX_CLR_STRUCT(def);

	PF_ADD_FLOAT_SLIDERX(	"Mix channels", 
							PORTABLE_MIN, 
							PORTABLE_BIG_MAX, 
							PORTABLE_MIN, 
							PORTABLE_MAX, 
							PORTABLE_DFLT,
							SLIDER_PRECISION, 
							DISPLAY_FLAGS,
							0,
							PORTABLE_DISK_ID);

	out_data->num_params = PORTABLE_NUM_PARAMS;

	return err;
}


static PF_Err 
SequenceSetup (	
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	PF_Err		err	= PF_Err_NONE;

	// Run the host-detection code when the effect is first applied to a clip
	// In After Effects, the message will display as a popup
	// In Premiere Pro, as of CS6, the message will be logged to the Events panel
	err = DetectHost(in_data, out_data);

	return err;
}

// This function is used to calculate the per-pixel result of the effect

static PF_Err 
PortableFunc (	
	void *refcon, 
	A_long x, 
	A_long y, 
	PF_Pixel *inP, 
	PF_Pixel *outP)
{
	PF_Err				err			= PF_Err_NONE;
	PortableRenderInfo	*sliderP	= (PortableRenderInfo*)refcon;
	A_FpShort			average		= 0;
	A_FpShort			midway_calc	= 0;
	
	// Mix the values
	// The higher the slider, the more we blend the channel with the average of all channels
	if (sliderP){
		average = (A_FpShort)(inP->red + inP->green + inP->blue) / 3;

		outP->alpha	= inP->alpha;
		midway_calc = (sliderP->slider_value * average);
		midway_calc = ((sliderP->slider_value * average) + (PORTABLE_MAX - sliderP->slider_value) * inP->red);
		outP->red	= (A_u_char) MIN(PF_MAX_CHAN8, ((sliderP->slider_value * average) + (100.0 - sliderP->slider_value) * inP->red) / 100.0);
		outP->green	= (A_u_char) MIN(PF_MAX_CHAN8, ((sliderP->slider_value * average) + (100.0 - sliderP->slider_value) * inP->green) / 100.0);
		outP->blue	= (A_u_char) MIN(PF_MAX_CHAN8, ((sliderP->slider_value * average) + (100.0 - sliderP->slider_value) * inP->blue) / 100.0);
	} else {
		err = PF_Err_BAD_CALLBACK_PARAM;
	}
	return err;
}

static PF_Err 
Render (
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	PF_Err				err			 		= PF_Err_NONE;
	PortableRenderInfo	render_info;

	render_info.slider_value = params[PORTABLE_SLIDER]->u.fs_d.value;
	
	// If the slider is 0 just make a direct copy.
	
	if (render_info.slider_value < 0.001) {
		ERR(PF_COPY(&params[0]->u.ld, 
					output, 
					NULL, 
					NULL));
	} else {
		 
		// clear all pixels outside extent_hint.

		if (in_data->extent_hint.left	!=	output->extent_hint.left	||
			in_data->extent_hint.top	!=	output->extent_hint.top		||
			in_data->extent_hint.right	!=	output->extent_hint.right	||
			in_data->extent_hint.bottom	!=	output->extent_hint.bottom) {
	
			ERR(PF_FILL(NULL, &output->extent_hint, output));
		}

		if (!err) {
		
			// iterate over image data.

			register A_long progress_heightL = in_data->extent_hint.top - in_data->extent_hint.bottom;
			
			ERR(PF_ITERATE(	0, 
							progress_heightL,
							&params[PORTABLE_INPUT]->u.ld, 
							&in_data->extent_hint,
							(void*)&render_info, 
							PortableFunc, 
							output));
		}
	}
	return err;
}

DllExport	
PF_Err EntryPointFunc(
	PF_Cmd			cmd,
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output,
	void			*extra)
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
		case PF_Cmd_SEQUENCE_SETUP:
			err = SequenceSetup(in_data,out_data,params,output);
			break;
		case PF_Cmd_RENDER:
			err = Render(in_data,out_data,params,output);
			break;
	}
	return err;
}

