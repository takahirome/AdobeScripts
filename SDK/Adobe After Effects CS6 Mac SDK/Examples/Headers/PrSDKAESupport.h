/*******************************************************************/
/*                                                                 */
/*                      ADOBE CONFIDENTIAL                         */
/*                   _ _ _ _ _ _ _ _ _ _ _ _ _                     */
/*                                                                 */
/* Copyright 2002 Adobe Systems Incorporated                       */
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


#ifndef PRSDKAESUPPORT_H
#define PRSDKAESUPPORT_H

#ifndef PRSDKTYPES_H
//#include "PrSDKTypes.h"
#endif

#ifndef PRSDKPIXELFORMAT_H
#include "PrSDKPixelFormat.h" 
#endif

#ifndef	__APPLE__
// Required for AE Stuff
#ifndef MSWindows
#define MSWindows 1
#endif
#endif

#ifndef _H_AE_Effect
#include "AE_Effect.h"
#endif

#ifndef _H_AE_EffectCB
#include "AE_EffectCB.h"
#endif

#ifndef csSDK_uint32
typedef unsigned int csSDK_uint32;
typedef int csSDK_int32;

#ifdef AE_OS_WIN
typedef signed __int64 csSDK_int64;
#elif defined AE_OS_MAC
typedef int64_t csSDK_int64;
#endif

typedef csSDK_int64 prInt64;
typedef csSDK_int32 prFieldType;
typedef csSDK_int32 PrTimelineID;
typedef csSDK_int32 PrClipID;
typedef prInt64 PrTime;
typedef struct
{
     csSDK_int64 opaque[2];
} PrSDKString;
#endif


#ifndef PREMIERE_INTERNAL
enum {
	PF_TimeDisplay_24 = 1,
	PF_TimeDisplay_25,
	PF_TimeDisplay_30Drop,
	PF_TimeDisplay_30NonDrop,
	PF_TimeDisplay_50,
	PF_TimeDisplay_60Drop,
	PF_TimeDisplay_60NonDrop,
	PF_TimeDisplay_NonStandard,
	PF_TimeDisplay_Invalid
};
typedef unsigned long	PF_TimeDisplay;
#endif

#define kPFPixelFormatSuite		"PF Pixel Format Suite"
#define kPFPixelFormatSuiteVersion1	1

typedef struct PF_PixelFormatSuite1
{
	SPAPI PF_Err	(*AddSupportedPixelFormat)(
					PF_ProgPtr			effect_ref,				/* reference from in_data */
					PrPixelFormat		pixelFormat);			/* add a supported pixel format */

	SPAPI PF_Err	(*ClearSupportedPixelFormats)(
					PF_ProgPtr			effect_ref);				/* reference from in_data */

	// not implemented yet
	SPAPI PF_Err	(*NewWorldOfPixelFormat)(
					PF_ProgPtr			effect_ref,				/* reference from in_data */
					A_u_long			width,
					A_u_long			height,
					PF_NewWorldFlags	flags,					/* should be pre-cleared to zeroes */
					PrPixelFormat		pixelFormat,
					PF_EffectWorld		*world);				/* always 32 bit */
	
	// not implemented yet
	SPAPI PF_Err	(*DisposeWorld)(							/* Identical to dispose_world in PF_WorldSuite */
					PF_ProgPtr			effect_ref,				/* reference from in_data */
					PF_EffectWorld		*world);


	SPAPI PF_Err (*GetPixelFormat)(
					PF_EffectWorld		*inWorld,				/* the pixel buffer of interest */
					PrPixelFormat		*pixelFormat);			/* one of the above PF_PixelFormat types */

	SPAPI PF_Err (*GetBlackForPixelFormat)(
					PrPixelFormat		pixelFormat,
					void*				pixelData);

	SPAPI PF_Err (*GetWhiteForPixelFormat)(
					PrPixelFormat		pixelFormat,
					void*				pixelData);

	SPAPI PF_Err (*ConvertColorToPixelFormattedData)(
					PrPixelFormat		pixelFormat,
					float				alpha,
					float				red,
					float				green,
					float				blue,
					void*				pixelData);

} PF_PixelFormatSuite1;


/********** Documentation ***********************************************
AddSupportedPixelFormat()
	During PF_Cmd_GLOBAL_SETUP a plug-in can add the formats it supports. By definition, 
	the 8-bit ARGB pixel format in use today will be the lowest priority, the default and doesn't 
	need to be added.  The default pixel format will be used when the rendering pipeline 
	indicates it would be optimal and minimizes color space conversions.  Within the scope of 
	Premiere, the effect_ref will be a reference to one of the many types of plug-ins (import, 
	compile, export, etc...).

NewWorldOfPixelFormat()
	Since the pixel buffers for some of the formats are very different in structure, an allocator 
	that understands the new formats would be a nice convenience and have some performance benefits.  
	For example, YCbCr(YUV) is often stored planar rather than packed.

DisposeWorld()
	This call is to balance the suite, however it's functionally equivalent to the dispose_world 
	in the PF_WorldSuite or the dispose_world callback in the _PF_UtilCallbacks.  However, all dispose 
	world calls will need to be updated to understand how to dispose of planar pixels.

GetPixelFormat()
	Retrieves the pixel format label of the PF_EffectWorld of interest.

SetPixelFormat()
	Sets the pixel format label of the PF_EffectWorld of interest.  It does not convert the pixels to the 
	format specified.  Perhaps this call doesn't need to be public, as the user will be using the 
	ConvertToPixelFormat() call which will set the format?

ConvertToPixelFormat()
	Used to convert a PF_EffectWorld to another pixel format, such as converting ARGB to YCbCr(YUV).  The 
	function would use built in conversion routines and would account for white and black levels while 
	performing appropriate clipping or scaling.
***********************************************************************/


#define kPFBackgroundFrameSuite				"PF Background Frame Suite"
#define kPFBackgroundFrameSuiteVersion1		1

typedef struct PF_BackgroundFrameSuite1
{
	SPAPI PF_Err	(*AddSupportedBackgroundTransferMode)(
						PF_ProgPtr effect_ref,								/* reference from in_data */
						PF_TransferMode supportedTransferMode,				/* transfer mode that an effect can use to composite on the background */
						PrPixelFormat supportedPixelFormat);				/* pixel format that the effect can composite with */
	
	SPAPI PF_Err	(*GetBackgroundFrame)(
					  PF_ProgPtr effect_ref,								/* reference from in_data */
					  PF_LayerDef** backgroundFrame,						/* the background frame, if any */
					  PF_TransferMode* backgroundTransferMode);				/* the transfer mode to be used on the background frame */
} PF_BackgroundFrameSuite1;

/********** Documentation ***********************************************
AddSupportedBackgroundTransferMode
	Called to register support for a transfer mode in a filter.
	The filter must be able to do its effect and composite onto the background.
	
GetBackgroundLayer()
	Get the background layer and the transfer mode.
	If the returned PF_LayerDef* is nil, there is no background frame.
***********************************************************************/


#define kPFUtilitySuite					"PF Utility Suite"
#define kPFUtilitySuiteVersion2			2
#define kPFUtilitySuiteVersion3			3
#define kPFUtilitySuiteVersion4			4

typedef struct PF_UtilitySuiteVersion1
{
	SPAPI PF_Err	(*GetFilterInstanceID)(
						PF_ProgPtr effect_ref,
						A_long* outFilterInstanceID);
} PF_UtilitySuiteVersion1;

typedef struct PF_UtilitySuite2
{
	SPAPI PF_Err	(*GetFilterInstanceID)(
						PF_ProgPtr effect_ref,
						A_long* outFilterInstanceID);
	SPAPI PF_Err	(*GetMediaTimecode)(
						PF_ProgPtr effect_ref, 
						A_long* outCurrentFrame, 
						PF_TimeDisplay* outTimeDisplay);
	SPAPI PF_Err	(*GetClipSpeed)( 
						PF_ProgPtr effect_ref,
						double*	speed);
	SPAPI PF_Err	(*GetClipDuration)( 
						PF_ProgPtr effect_ref,
						A_long* frameDuration);
} PF_UtilitySuite2;

typedef struct PF_UtilitySuite3
{
	SPAPI PF_Err	(*GetFilterInstanceID)(
						PF_ProgPtr effect_ref,
						A_long* outFilterInstanceID);
	SPAPI PF_Err	(*GetMediaTimecode)(
						PF_ProgPtr effect_ref, 
						A_long* outCurrentFrame, 
						PF_TimeDisplay* outTimeDisplay);
	SPAPI PF_Err	(*GetClipSpeed)( 
						PF_ProgPtr effect_ref,
						double*	speed);
	SPAPI PF_Err	(*GetClipDuration)( 
						PF_ProgPtr effect_ref,
						A_long* frameDuration);
	SPAPI PF_Err	(*GetClipStart)( 
						PF_ProgPtr effect_ref,
						A_long* frameDuration);
	SPAPI PF_Err	(*GetUnscaledClipDuration)( 
						PF_ProgPtr effect_ref,
						A_long* frameDuration);
	SPAPI PF_Err	(*GetUnscaledClipStart)( 
						PF_ProgPtr effect_ref,
						A_long* frameDuration);
	SPAPI PF_Err	(*GetTrackItemStart)( 
						PF_ProgPtr effect_ref,
						A_long* frameDuration);
	SPAPI PF_Err	(*GetMediaFieldType)( 
						PF_ProgPtr effect_ref,
						prFieldType* outFieldType);
	SPAPI PF_Err	(*GetMediaFrameRate)( 
						PF_ProgPtr effect_ref,
						PrTime* outTicksPerFrame);
	SPAPI PF_Err	(*GetContainingTimelineID)( 
						PF_ProgPtr effect_ref,
						PrTimelineID* outTimelineID);
} PF_UtilitySuite3;

typedef struct PF_UtilitySuite4
{
	SPAPI PF_Err	(*GetFilterInstanceID)(
						PF_ProgPtr effect_ref,
						A_long* outFilterInstanceID);
	SPAPI PF_Err	(*GetMediaTimecode)(
						PF_ProgPtr effect_ref, 
						A_long* outCurrentFrame, 
						PF_TimeDisplay* outTimeDisplay);
	SPAPI PF_Err	(*GetClipSpeed)( 
						PF_ProgPtr effect_ref,
						double*	speed);
	SPAPI PF_Err	(*GetClipDuration)( 
						PF_ProgPtr effect_ref,
						A_long* frameDuration);
	SPAPI PF_Err	(*GetClipStart)( 
						PF_ProgPtr effect_ref,
						A_long* frameDuration);
	SPAPI PF_Err	(*GetUnscaledClipDuration)( 
						PF_ProgPtr effect_ref,
						A_long* frameDuration);
	SPAPI PF_Err	(*GetUnscaledClipStart)( 
						PF_ProgPtr effect_ref,
						A_long* frameDuration);
	SPAPI PF_Err	(*GetTrackItemStart)( 
						PF_ProgPtr effect_ref,
						A_long* frameDuration);
	SPAPI PF_Err	(*GetMediaFieldType)( 
						PF_ProgPtr effect_ref,
						prFieldType* outFieldType);
	SPAPI PF_Err	(*GetMediaFrameRate)( 
						PF_ProgPtr effect_ref,
						PrTime* outTicksPerFrame);
	SPAPI PF_Err	(*GetContainingTimelineID)( 
						PF_ProgPtr effect_ref,
						PrTimelineID* outTimelineID);
	SPAPI PF_Err	(*GetClipName)(
						PF_ProgPtr effect_ref,
						PrSDKString * outSDKString);
	SPAPI PF_Err	(*EffectWantsCheckedOutFramesToMatchRenderPixelFormat)(
						PF_ProgPtr effect_ref);
} PF_UtilitySuite4;

/********** Documentation ***********************************************
GetFilterInstanceID
	An AE filter running in Premiere can call this method to obtain
	its instance ID from the PF_InData->effect_ref.  The instance ID
	obtained is the same value contained in the prtFilterRec of its RT segment.
GetMediaTimecode
	Returns the starting timecode of the media file.
GetClipSpeed
	Returns the playback rate of the underlying clip in the timeline 
	(negative speed means backwards playback).
GetClipDuration
	Returns the trimmed duration (in frames) of the underlying clip in 
	the timeline.
***********************************************************************/

#endif // PRSDKAESUPPORT_H

