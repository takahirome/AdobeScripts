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

#ifndef Custom_ECW_UI_H
#define Custom_ECW_UI_H

#pragma once 

#define PF_DEEP_COLOR_AWARE 1	// make sure we get 16bpc pixels; 
								// AE_Effect.h checks for this.
#include "AEConfig.h"
#include "entry.h"
#include "AE_EffectUI.h"
#include "AE_EffectCBSuites.h"
#include "AE_AdvEffectSuites.h"
#include "AE_EffectSuitesHelper.h"
#include "String_Utils.h"
#include "AEGP_SuiteHandler.h"
#include "Param_Utils.h"
#include "AE_Macros.h"
#include "Custom_ECW_UI_Strings.h"

#ifdef AE_OS_WIN
	#include <windows.h>
#endif

#define	MAJOR_VERSION		2
#define	MINOR_VERSION		0
#define	BUG_VERSION			0
#define	STAGE_VERSION		PF_Stage_DEVELOP
#define	BUILD_VERSION		1
#define ID					4111

#ifdef __cplusplus
	extern "C" {
#endif

enum {
	ECW_UI_INPUT = 0,
	ECW_UI_COLOR,	
	ECW_UI_NUM_PARAMS
};

enum {
	ECW_UI_COLOR_DISK_ID = 1
};

typedef struct 
{
	int		number;
	char	name[256];
} my_global_data, *my_global_dataP, **my_global_dataH;

#define ECW_UI_MAGIC	'WONK'

#define UI_BOX_WIDTH			150
#define UI_BOX_HEIGHT			150

PF_Err	
HandleEvent(
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output,
	PF_EventExtra	*extra);

DllExport PF_Err 
EntryPointFunc (	
	PF_Cmd			cmd,
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output,
	void			*extra );
	
#ifdef __cplusplus
	}
#endif

#endif  // Custom_ECW_UI_H
