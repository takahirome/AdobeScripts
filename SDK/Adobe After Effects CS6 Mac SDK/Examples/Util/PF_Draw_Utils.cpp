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

/* PF_Draw_Utils.cpp

	Use these functions to avoid platform-specific drawing issues. 
	
	Part of the Adobe After Effects 8.0 SDK.
	
	1.0 created by bbb for 5.0 SDK
	2.0	updated for 5.5

*/

#include "AEConfig.h"
#include "PF_Draw_Utils.h"
#include "AE_Effect.h"
#include "AE_EffectCB.h"
#include "AE_EffectUI.h"
#include "AE_Macros.h"
#include "AE_EffectSuites.h"
#include "AE_AdvEffectSuites.h"
#include "PF_Suite_Helper.h"

/*	Yes, folks, we're relying on the QuickTime SDK */

#ifndef __MACH__
	#include <Events.h>
	#include <math.h>
	#include "Quickdraw.h"
	#include <QDOffscreen.h>
#endif

#ifdef AE_OS_WIN
	#include <windows.h>
	#include <wingdi.h>
#endif

void 
PF_SetRect(		PF_Rect	*rect, 
				short	left, 
				short	top,
				short	right, 
				short	bottom)
{
	rect->left		=	left;
	rect->top		=	top;
	rect->right		=	right;
	rect->bottom	=	bottom;
}

#ifdef AE_OS_WIN
void
PF_CopyWin_RectToPF_Rect(PF_Rect *out_rect,RECT *in_rect)
{
	out_rect->left		=	(short)in_rect->left;
	out_rect->top		=	(short)in_rect->top;
	out_rect->right		=	(short)in_rect->right;
	out_rect->bottom	=	(short)in_rect->bottom;
}

void
PF_Rect_To_Win_Rect(PF_Rect *in_rect, RECT *out_rect)
{
	out_rect->left		=	in_rect->left;
	out_rect->top		=	in_rect->top;
	out_rect->right		=	in_rect->right;
	out_rect->bottom	=	in_rect->bottom;
}	
#endif
void
PF_SetFixedRect(PF_FixedRect	*rect, 
				PF_Fixed		left, 
				PF_Fixed		top,
				PF_Fixed		right, 
				PF_Fixed		bottom)
{
	rect->left		=	left;
	rect->top		=	top;
	rect->right		=	right;
	rect->bottom	=	bottom;
}
void 
PF_LineTo(	PF_InData	*in_data,
			PF_ContextH	contextH,
			short		x,
			short		y)
{
#ifdef AE_OS_WIN
	HDC		hdc;
	PF_GET_CGRAF_DATA((*contextH)->cgrafptr, PF_CGrafData_HDC, reinterpret_cast<void**>(&hdc));
	LineTo(hdc, (int)x, (int)y);
#else
	LineTo(x, y);
#endif
}

void 
PF_FrameRect(	PF_InData	*in_data,
				PF_ContextH	contextH,
				PF_Rect		*Rect)
{

#ifdef AE_OS_WIN
	HDC		hdc;
	HBRUSH Brush = reinterpret_cast<HBRUSH>(GetStockObject(BLACK_BRUSH));
	PF_GET_CGRAF_DATA((*contextH)->cgrafptr, PF_CGrafData_HDC, reinterpret_cast<void**>(&hdc));
	FrameRect(hdc, (RECT*)Rect, Brush);
#else
	FrameRect(Rect);
#endif
}

PF_Boolean 
PF_PtInRect(		PF_Point	point,
				PF_Rect		*rect)
{
#ifdef AE_OS_WIN
	RECT	w_rect;
	POINT	w_point;

	w_rect.left		=	rect->left;
	w_rect.top		=	rect->top;
	w_rect.right 	=	rect->right;
	w_rect.bottom	=	rect->bottom;

	w_point.x = point.h;
	w_point.y = point.v;

	return PtInRect(&w_rect, w_point);
#else
	return PtInRect(point, rect);
#endif
}

void 
PF_EraseRect (	PF_InData	*in_data,
				PF_ContextH	contextH,
				PF_Rect		*rect)
{
#ifdef AE_OS_WIN
	HDC	hdc;
	HBRUSH Brush	=	reinterpret_cast<HBRUSH>(GetStockObject(WHITE_BRUSH));
	PF_GET_CGRAF_DATA((*contextH)->cgrafptr, PF_CGrafData_HDC, reinterpret_cast<void**>(&hdc));
	FillRect(hdc, (RECT*)rect, Brush);
#else
	EraseRect((Rect*)rect);
#endif
}

void 
PF_MoveTo(	PF_InData		*in_data,
			PF_ContextH		contextH,
			short			x,
			short			y)
{
#ifdef AE_OS_WIN
	HDC		hdc;
	PF_GET_CGRAF_DATA((*contextH)->cgrafptr, PF_CGrafData_HDC, reinterpret_cast<void**>(&hdc));
	MoveToEx(hdc, (int)x, (int)y, NULL);
#else
	MoveTo(x, y);
#endif
}

void 
PF_FillPoly(PF_InData		*in_data,
			PF_ContextH		contextH,
			PolyHandle		poly)

{
#ifdef AE_OS_WIN
	HDC	hdc;
	HBRUSH Brush	=	reinterpret_cast<HBRUSH>(GetStockObject(WHITE_BRUSH));
	PF_GET_CGRAF_DATA((*contextH)->cgrafptr, PF_CGrafData_HDC, reinterpret_cast<void**>(&hdc));
	FillRgn(hdc, (HRGN)*poly, Brush);
#else
	FillPoly(poly, &in_data->qd_globals->gray);
#endif
}

void 
PF_InvertRect(	PF_InData		*in_data,
				PF_ContextH		contextH,
				PF_Rect			*rect)
{
#ifdef AE_OS_WIN
	HDC		hdc;
	RECT	w_rect;
	
	w_rect.left = rect->left;
	w_rect.top = rect->top;
	w_rect.right = rect->right;
	w_rect.bottom = rect->bottom;

	PF_GET_CGRAF_DATA((*contextH)->cgrafptr, PF_CGrafData_HDC, reinterpret_cast<void**>(&hdc));
	InvertRect(hdc, &w_rect);
#else
	InvertRect((Rect*)rect);
#endif
}


long 
PF_PenXor(	PF_InData		*in_data,
			PF_ContextH		contextH)
{
	long old_mode;
#ifdef AE_OS_WIN
	HDC	hdc;
	PF_GET_CGRAF_DATA((*contextH)->cgrafptr, PF_CGrafData_HDC, reinterpret_cast<void**>(&hdc));
	old_mode = SetROP2(hdc, R2_NOT);
#else
	GrafPtr dp = reinterpret_cast<OpaqueGrafPtr*>((*contextH)->cgrafptr);
	old_mode = GetPortPenMode(dp);
	PenMode(patXor);
#endif
	return old_mode;
}


void 
PF_PenRestore(	PF_InData		*in_data,
				PF_ContextH		contextH,
				long				pen_restore)
{
#ifdef AE_OS_WIN
	HDC		hdc;
	PF_GET_CGRAF_DATA((*contextH)->cgrafptr, PF_CGrafData_HDC, reinterpret_cast<void**>(&hdc));
	SetROP2(hdc, pen_restore);
#else
	PenMode((short)pen_restore);
#endif
}

PF_Err	
AcquireBackgroundColor(	
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_EventExtra	*event_extra,
	PF_App_Color	*app_color)
{

	PF_Err			err		= PF_Err_NONE,
					err2	= PF_Err_NONE;
					
	PFAppSuite1		*app_suiteP = NULL;
	PF_App_Color	local_color = {0,0,0};

	ERR(AEFX_AcquireSuite(	in_data,
							out_data,
							kPFAppSuite,
							kPFAppSuiteVersion1,
							NULL,
							(void**)&app_suiteP));

	if (app_suiteP) {
		ERR(app_suiteP->PF_AppGetBgColor(&local_color));
		if (!err) {
			app_color->red	=   local_color.red;
			app_color->green=	local_color.green;
			app_color->blue	=	local_color.blue;
		}
	}
	ERR2(AEFX_ReleaseSuite(	in_data,
							out_data,
							kPFAppSuite,
							kPFAppSuiteVersion1,
							NULL));
	return err;
}

/*
	given a PF_world, and a rect position and size, and a gray value
	between 0 and 255, will paint a gray rectangle in the PF World
*/
void	
PF_World_PaintRect(	PF_EffectWorld	*world, 
					unsigned long	x_pos, 
					unsigned long	y_pos, 
					unsigned long	x_delta, 
					unsigned long	y_delta, 
					unsigned char	color)
{
	register	unsigned long	x_pix = 0, y_pix = 0;
	register	char			*data = (char *)(world->data);
	register	PF_Pixel			*p = 0;

	for (y_pix = y_pos; y_pix <= y_pos + y_delta; y_pix++) {
		for (x_pix = x_pos; x_pix <= x_pos + x_delta; x_pix++) {
		
			p = (PF_Pixel *)(data + y_pix * world->rowbytes) + x_pix;

			p->alpha	= 255;
			p->red		= color;
			p->blue		= color;
			p->green	= color;
		}
	}
}

