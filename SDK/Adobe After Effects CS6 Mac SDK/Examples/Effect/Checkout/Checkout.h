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

/**
	Checkout.h
	
	Part of the Adobe After Effects 8.0 SDK.
	Copyright 2007 Adobe Systems Incorporated.
	All Rights Reserved.

	Revision History
		1.0 		 							bbb
		1.1 folded ADM sample code into project	bbb
**/

#pragma once

#ifndef CHECKOUT_H
#define CHECKOUT_H

#include "AEConfig.h"
#include "entry.h"

#include "AE_Effect.h"
#include "AE_EffectCB.h"		
#include "AE_Macros.h"
#include "AE_ChannelSuites.h"
#include "AE_EffectSuites.h"

#include "Param_Utils.h"
#include "AEFX_SuiteHelper.h"		// PICA Suite Stuff
#include "DuckSuite.h"


#define	MAJOR_VERSION	2
#define	MINOR_VERSION	0
#define	BUG_VERSION		0
#define	STAGE_VERSION	PF_Stage_DEVELOP
#define	BUILD_VERSION	0


#define	NAME				"Checkout"
#define DESCRIPTION			"Checks out layers at other times.\rCopyright 1994-2007\r\rAdobe Systems Incorporated."

enum {
	CHECK_INPUT = 0,
	CHECK_FRAME,
	CHECK_LAYER,
	CHECK_NUM_PARAMS
};

enum {
	CHECK_FRAME_DISK_ID = 1,
	CHECK_LAYER_DISK_ID
};

#define	CHECK_FRAME_MIN		0
#define	CHECK_FRAME_MAX		100
#define	CHECK_FRAME_DFLT	0

extern "C" {

DllExport	
PF_Err 
EntryPointFunc (
	PF_Cmd			cmd,
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output );

}

#endif // CHECKOUT_H