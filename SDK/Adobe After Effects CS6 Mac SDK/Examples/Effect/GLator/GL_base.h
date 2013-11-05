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
	GL_base.h
*/

#pragma once

#ifndef GL_BASE_H
#define GL_BASE_H

#include "AEConfig.h"

//OS specifc includes
#ifdef AE_OS_WIN
	#include <windows.h>
	#include <stdlib.h>
	#include <GL\gl.h>
	#include <GL\glu.h>
	#include <glext.h>      // [TODO]: Sample's header file, see if it can be removed
#elif defined(AE_OS_MAC)
	#include <OpenGL/OpenGL.h>
	#include <OpenGL/gl.h>
	#include <OpenGL/glu.h>
	#include <OpenGL/glext.h>
	#include <AGL/agl.h>
#endif

//general includes
#include <string>
#include <fstream>
using namespace std;

//typedefs
typedef unsigned char		u_char;
typedef unsigned short		u_short;
typedef unsigned short		u_int16;
typedef unsigned long		u_long;
typedef short int			int16;

namespace AESDK_OpenGL
{

/*
// Global (to the effect) supporting OpenGL variables
*/

struct AESDK_OpenGL_EffectCommonData
{
	GLuint mFrameBufferSu;
	GLuint mFrameDepthRenderBufferSu;
	GLuint mColorRenderBufferSu;

	u_int16 mRenderBufferWidthSu;
	u_int16 mRenderBufferHeightSu;

	GLhandleARB mProgramObjSu;
	GLhandleARB mVertexShaderSu;
	GLhandleARB mFragmentShaderSu;
	bool		mUsingShaderB;

	//OS specific handles
#ifdef AE_OS_WIN
	HWND	mHWnd;
	HDC		mHDC;
	HGLRC	mHRC;
#elif defined(AE_OS_MAC)
	WindowRef	mMacWnd;
	AGLContext  mAGLContext;
#endif
};

enum AESDK_OpenGL_Err
{
	AESDK_OpenGL_OK = 0,
	AESDK_OpenGL_OS_Load_Err,
	AESDK_OpenGL_OS_Unload_Err,
	AESDK_OpenGL_Res_Load_Err,
	AESDK_OpenGL_Res_Unload_Err,
	AESDK_OpenGL_Extensions_Err,
	AESDK_OpenGL_ShaderInit_Err,
	AESDK_OpenGL_Unknown_Err
};

/*
// Core functions
*/
AESDK_OpenGL_Err AESDK_OpenGL_InitResources(AESDK_OpenGL_EffectCommonData& inData, u_short inBufferWidth = 1024, u_short inBufferHeight = 1024);
AESDK_OpenGL_Err AESDK_OpenGL_MakeReadyToRender(AESDK_OpenGL_EffectCommonData& inData);
AESDK_OpenGL_Err AESDK_OpenGL_ReleaseResources(AESDK_OpenGL_EffectCommonData& inData);
AESDK_OpenGL_Err AESDK_OpenGL_Startup(AESDK_OpenGL_EffectCommonData& inData);
AESDK_OpenGL_Err AESDK_OpenGL_Shutdown(AESDK_OpenGL_EffectCommonData& inData);
AESDK_OpenGL_Err AESDK_OpenGL_InitShader( AESDK_OpenGL_EffectCommonData& inData, string inVertexShaderFile, string inFragmentShaderFile );
AESDK_OpenGL_Err AESDK_OpenGL_BindTextureToTarget(AESDK_OpenGL_EffectCommonData& inData, GLint inTexture, string inTargetName);
void AESDK_OpenGL_StartRenderToShader(AESDK_OpenGL_EffectCommonData& inData);
void AESDK_OpenGL_StopRenderToShader();

/*
// Independent macros and helper functions
*/

//GetProcAddress
#ifdef AE_OS_WIN
	#define GetProcAddress(N) wglGetProcAddress((LPCSTR)N)
#elif defined(AE_OS_MAC)
	#define GetProcAddress(N) NSGLGetProcAddress(N)
#endif

//helper function - error reporting util
string ReportError( AESDK_OpenGL_Err inError);
//helper function - check frame buffer status before final render call
string CheckFramebufferStatus();
//helper function - read shader file into the compiler
unsigned char* ReadShaderFile( string inFile );

/*
//	Error class and macros used to trap errors
*/
class AESDK_OpenGL_Fault 
{
public:
	AESDK_OpenGL_Fault(AESDK_OpenGL_Err inError)
	{
		mError = inError;
	}
	operator AESDK_OpenGL_Err()
	{
		return mError;
	}

protected:
	AESDK_OpenGL_Err mError;
};

#define GL_CHECK(err) {AESDK_OpenGL_Err err1 = err; if (err1 != AESDK_OpenGL_OK ){ throw AESDK_OpenGL_Fault(err1);}}

};
#endif // GL_BASE_H