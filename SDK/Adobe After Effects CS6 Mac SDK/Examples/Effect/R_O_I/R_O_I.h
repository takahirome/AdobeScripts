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

#pragma once

#ifndef R_O_I_H
#define R_O_I_H

#define PF_DEEP_COLOR_AWARE 1	// make sure we get 16bpc pixels; 
								// AE_Effect.h checks for this.
#include "entry.h"
#include "AE_Effect.h"
#include "AE_EffectCB.h"
#include "AE_Macros.h"
#include "Param_Utils.h"
#include "AE_EffectCBSuites.h"
#include "String_Utils.h"
#include "AE_GeneralPlug.h"
#include "AEGP_SuiteHandler.h"
#include "PF_Suite_Helper.h"
#include "R_O_I_Strings.h"

#ifdef AE_OS_WIN
	#include <Windows.h>
	#include "string.h"
	
	//	Just for kicks, let's enable heap validation with every
	//	memory operation at application shutdown.
	
	#include <crtdbg.h>

	Ê// Get current flag
	Ê
	int tmpFlag = 	_CrtSetDbgFlag( _CRTDBG_REPORT_FLAG );
	tmpFlag 	|= 	_CRTDBG_CHECK_ALWAYS_DF;

	// Set flag to the new value

	Ê_CrtSetDbgFlag( tmpFlag );
#endif

/* Versioning information */

#define	MAJOR_VERSION	1
#define	MINOR_VERSION	0
#define	BUG_VERSION		0
#define	STAGE_VERSION	PF_Stage_DEVELOP
#define	BUILD_VERSION	1


/* Parameter defaults */

#define	ROI_AMOUNT_MIN	0.0
#define	ROI_AMOUNT_MAX	100.0
#define	ROI_AMOUNT_DFLT	93.0
#define ROI_SIZE_MAX 1000.0

enum 
{
	ROI_INPUT = 0,
	ROI_MODE,
	ROI_AMOUNT,
	ROI_SIZE,
	ROI_DOWNSAMPLE,
	ROI_COLOR,
	ROI_NUM_PARAMS
};

enum 
{
	POPUP_DISK_ID  = 1,
	AMOUNT_DISK_ID,
	COLOR_DISK_ID,
	DOWNSAMPLE_DISK_ID,
	SIZE_DISK_ID
};

#define KERNEL_SIZE 3

enum {
	OLD_SKOOL = 0,
	NEW_SKOOL,
	padding2,
	IGNORE_ALPHA,
	NUM_POPUP_CHOICES
};

typedef struct ROI_RenderInfo {
	PF_PixelFloat	color;
	PF_LRect		rectR;
	A_Boolean		we_care_about_alphaB;
	PF_FpLong		amountF;
} ROI_RenderInfo;

/* Prototypes */

#ifdef __cplusplus
	extern "C" {
#endif

DllExport	PF_Err 
EntryPointFunc (	
	PF_Cmd			cmd,
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output,
	void			*extra) ;

#ifdef __cplusplus
	}
#endif

#endif // R_O_I_H