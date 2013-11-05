// AE_EffectSuitesOld.h
//
// Copyright (c) 2011 Adobe Systems Inc, Seattle WA
// All Rights Reserved
//
// These are old, deprecated versions of some suites. Please use the ones in AE_EffectSuites.h instead if at all possible.
//
//

// 
#ifndef _H_AE_EffectSuitesOld
	#error this file is designed to be included only by AE_EffectSuites.h; do not include directly
#endif

/** PF_ParamUtilsSuite1

	PF_UpdateParamUI()

	You can call this function for each param whose UI settings you
	want to change when handling a PF_Cmd_USER_CHANGED_PARAM or
	PF_Cmd_UPDATE_PARAMS_UI.  These changes are cosmetic only, and don't
	go into the undo buffer.

	The ONLY fields that can be changed in this way are:

	PF_ParamDef
	ui_flags: PF_PUI_ECW_SEPARATOR, PF_PUI_DISABLED only (and PF_PUI_INVISIBLE in Premiere).
	ui_width
	ui_height
	name
	flags: PF_ParamFlag_COLLAPSE_TWIRLY only

	PF_ParamDefUnion:
	slider_min, slider_max, precision, display_flags of any slider type

	For PF_PUI_STD_CONTROL_ONLY params, you can also change the value field by setting
	PF_ChangeFlag_CHANGED_VALUE before returning.  But you are not allowed to change
	the value during PF_Cmd_UPDATE_PARAMS_UI.

	PF_HaveInputsChangedOverTimeSpan()
	This new API is handy for effects that do simulation across time, where frame N is
	dependent on frame N-1, and you have a cache in your sequence data that needs validating.
	When asked to render frame N, assume you have your cached data from frame N-1, you'd call
	PF_HaveInputsChangedOverTimeSpan(start=0, duration=N-1) to see if your cache is still valid.
	The state of all parameters (except those with PF_ParamFlag_EXCLUDE_FROM_HAVE_INPUTS_CHANGED
	set), including layer parameters (including param[0]) are checked over the passed time
	span. This is done efficiently, as the change tracking is done with timestamps.

	Requires PF_OutFlag2_AUTOMATIC_WIDE_TIME_INPUT to be set by the effect. If validating a
	cache for use during a render, the call to PF_HaveInputsChangedOverTimeSpan() must
	happen during one of the rendering PF_Cmds (PF_Cmd_FRAME_SETUP, PF_Cmd_RENDER,
	PF_Cmd_FRAME_SETDOWN,PF_Cmd_SMART_PRE_RENDER, PF_Cmd_SMART_RENDER).

	If *changedPB is returned FALSE, you can safely use your cache, AND the internal
	caching system will assume that you have a temporal dependency on the passed range,
	so if something changes upstream, AE's caches will be properly invalidated.		

**/

#define kPFParamUtilsSuiteVersion1	2	/* 64-bit version frozen in AE 10.0 */	


typedef struct PF_ParamUtilsSuite1 {

	SPAPI PF_Err	(*PF_UpdateParamUI)(
		PF_ProgPtr			effect_ref,
		PF_ParamIndex		param_index,
		const PF_ParamDef	*defP);

	// The next 3 methods have had "Obsolete" added to their name to intentionally
	// break compile compatibility. They continue to work and are binary compatible, but
	// are more conservative and inefficient than in previous versions. Please
	// switch to the current version of this suite for maximum benefit.
	SPAPI PF_Err	(*PF_GetCurrentStateObsolete)(
		PF_ProgPtr			effect_ref,
		PF_State			*stateP);		/* << */

	SPAPI PF_Err	(*PF_HasParamChangedObsolete)(
		PF_ProgPtr			effect_ref,
		const PF_State		*stateP,		// has param changed since this state was grabbed
		PF_ParamIndex		param_index,	// ignored, always treated as PF_ParamIndex_CHECK_ALL_HONOR_EXCLUDE - go use the modern version of this suite!
		//	have changed including layer param[0];
		// pass PF_ParamIndex_CHECK_ALL_EXCEPT_LAYER_PARAMS to see
		//	if any non-layer param values have changed
		PF_Boolean			*changedPB);	/* << */

	SPAPI PF_Err	(*PF_HaveInputsChangedOverTimeSpanObsolete)(			// see comment above
		PF_ProgPtr			effect_ref,
		const PF_State		*stateP,		// has param changed since this state was grabbed
		const A_Time		*startPT0,		// NULL for both start & duration mean at any time
		const A_Time		*durationPT0,
		PF_Boolean			*changedPB);	/* << */

	SPAPI PF_Err	(*PF_IsIdenticalCheckout)(
		PF_ProgPtr			effect_ref,
		PF_ParamIndex		param_index,
		A_long				what_time1,
		A_long				time_step1,
		A_u_long		time_scale1,
		A_long				what_time2,
		A_long				time_step2,
		A_u_long		time_scale2,
		PF_Boolean			*identicalPB);		/* << */


	SPAPI PF_Err	(*PF_FindKeyframeTime)(
		PF_ProgPtr			effect_ref,
		PF_ParamIndex		param_index,
		A_long				what_time,
		A_u_long		time_scale,
		PF_TimeDir			time_dir,
		PF_Boolean			*foundPB,			/* << */
		PF_KeyIndex			*key_indexP0,		/* << */
		A_long				*key_timeP0,		/* << */	// you can ask for either:
		A_u_long		*key_timescaleP0);	/* << */	// time&timescale OR neither

	SPAPI PF_Err	(*PF_GetKeyframeCount)(
		PF_ProgPtr			effect_ref,
		PF_ParamIndex		param_index,
		PF_KeyIndex			*key_countP);		/* << */	// returns PF_KeyIndex_NONE for constant

	SPAPI PF_Err	(*PF_CheckoutKeyframe)(
		PF_ProgPtr			effect_ref,
		PF_ParamIndex		param_index,
		PF_KeyIndex			key_index,			// zero-based
		A_long				*key_timeP0,		/* << */	// you can ask for either:
		A_u_long		*key_timescaleP0,	/* << */	// time&timescale OR neither
		PF_ParamDef			*paramP0);			/* << */

	SPAPI PF_Err	(*PF_CheckinKeyframe)(
		PF_ProgPtr			effect_ref,
		PF_ParamDef			*paramP);

	SPAPI PF_Err	(*PF_KeyIndexToTime)(
		PF_ProgPtr			effect_ref,
		PF_ParamIndex		param_index,
		PF_KeyIndex			key_indexP,			/* >> */
		A_long				*key_timeP,			/* >> */
		A_u_long		*key_timescaleP);	/* << */

} PF_ParamUtilsSuite1;



