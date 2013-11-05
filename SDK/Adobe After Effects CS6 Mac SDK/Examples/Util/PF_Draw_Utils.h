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

/* PF_Draw_Utils.h 

	Function declarations for cross-platform drawing functions.

*/
#include "A.h"
#include "AE_Effect.h"
#include "AE_EffectCB.h"
#include "AE_EffectUI.h"
#include "AE_EffectSuites.h"
#include "AE_AdvEffectSuites.h"

/* Warning: QuickDraw is required for the use of these utility functions. */

#ifndef __MACH__
	#include <Quickdraw.h>
#endif

#ifdef AE_OS_WIN
	#include <windows.h>
	#include <wingdi.h>
#endif

void 
PF_LineTo(
	PF_InData		*in_data,
	PF_ContextH		contextH,
	short			x,
	short			y);

void 
PF_SetRect(
	PF_Rect			*rect, 
	short			left, 
	short			top, 
	short			right, 
	short			bottom);

#ifdef AE_OS_WIN
void
PF_CopyWin_RectToPF_Rect(
	PF_Rect			*out_rect,
	RECT			*in_rect);

void
PF_Rect_To_Win_Rect(
	PF_Rect			*in_rect, 
	RECT			*out_rect);
#endif
				
void
PF_SetFixedRect(
	PF_FixedRect	*rect, 
	PF_Fixed		left, 
	PF_Fixed		top,
	PF_Fixed		right, 
	PF_Fixed		bottom);

void 
PF_MoveTo(
		PF_InData		*in_data,
		PF_ContextH		contextH,
		short			x,
		short			y);

void
PF_FrameRect(
	PF_InData		*in_data,
	PF_ContextH		contextH,
	PF_Rect			*rect);

PF_Boolean 
PF_PtInRect(
	PF_Point		point,
	PF_Rect			*rect);

void 
PF_EraseRect (
	PF_InData		*in_data,
	PF_ContextH		contextH,
	PF_Rect			*rect);


void 
PF_FillPoly(
	PF_InData		*in_data,
	PF_ContextH		contextH,
	PolyHandle		poly);

void 
PF_InvertRect(
	PF_InData		*in_data,
	PF_ContextH		contextH,
	PF_Rect			*rect);

long 
PF_PenXor(
	PF_InData		*in_data,
	PF_ContextH		contextH);

void 
PF_PenRestore(
	PF_InData		*in_data,
	PF_ContextH		contextH,
	long			pen_restore);

void 
PF_SetRect	(
PF_Rect		*r,
 short 		left,
 short 		top,
 short 		right,
 short 		bottom);

void
PF_SetFixedRect(
	PF_FixedRect	*rect, 
	PF_Fixed		left, 
	PF_Fixed		top,
	PF_Fixed		right, 
	PF_Fixed		bottom);
				
PF_Err	
AcquireBackgroundColor(
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_EventExtra	*event_extra,
	PF_App_Color	*app_color);

void	
PF_World_PaintRect(	
	PF_EffectWorld	*world, 
	unsigned long	x_pos, 
	unsigned long	y_pos, 
	unsigned long	x_delta, 
	unsigned long	y_delta, 
	unsigned char	color);

