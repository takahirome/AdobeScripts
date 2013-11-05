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

/*	GL_base.cpp

	This file invokes the basic OpenGL framework, keeping in mind that
	you would render to a hidden surface (FBO) and read-back into an AE frame
	
	Revision history: 

	1.0 Win and Mac versions use the same base files.	anindyar	7/4/2007
*/

#include "GL_base.h"

#include <stdlib.h>
#include <stdio.h>
#ifdef AE_OS_WIN
#include <stdint.h>
#endif

namespace AESDK_OpenGL
{

/*
// extern declarations - not needed for AE_OS_MAC
*/
#ifdef AE_OS_WIN
//EXT_framebuffer_object - http://oss.sgi.com/projects/ogl-sample/registry/EXT/framebuffer_object.txt
extern PFNGLISRENDERBUFFEREXTPROC glIsRenderbufferEXT = NULL;
extern PFNGLBINDRENDERBUFFEREXTPROC glBindRenderbufferEXT = NULL;
extern PFNGLDELETERENDERBUFFERSEXTPROC glDeleteRenderbuffersEXT = NULL;
extern PFNGLGENRENDERBUFFERSEXTPROC glGenRenderbuffersEXT = NULL;
extern PFNGLRENDERBUFFERSTORAGEEXTPROC glRenderbufferStorageEXT = NULL;
extern PFNGLGETRENDERBUFFERPARAMETERIVEXTPROC glGetRenderbufferParameterivEXT = NULL;
extern PFNGLISFRAMEBUFFEREXTPROC glIsFramebufferEXT = NULL;
extern PFNGLBINDFRAMEBUFFEREXTPROC glBindFramebufferEXT = NULL;
extern PFNGLDELETEFRAMEBUFFERSEXTPROC glDeleteFramebuffersEXT = NULL;
extern PFNGLGENFRAMEBUFFERSEXTPROC glGenFramebuffersEXT = NULL;
extern PFNGLCHECKFRAMEBUFFERSTATUSEXTPROC glCheckFramebufferStatusEXT = NULL;
extern PFNGLFRAMEBUFFERTEXTURE1DEXTPROC glFramebufferTexture1DEXT = NULL;
extern PFNGLFRAMEBUFFERTEXTURE2DEXTPROC glFramebufferTexture2DEXT = NULL;
extern PFNGLFRAMEBUFFERTEXTURE3DEXTPROC glFramebufferTexture3DEXT = NULL;
extern PFNGLFRAMEBUFFERRENDERBUFFEREXTPROC glFramebufferRenderbufferEXT = NULL;
extern PFNGLGETFRAMEBUFFERATTACHMENTPARAMETERIVEXTPROC glGetFramebufferAttachmentParameterivEXT = NULL;
extern PFNGLGENERATEMIPMAPEXTPROC glGenerateMipmapEXT = NULL;

// GL_ARB_shader_objects
extern PFNGLCREATEPROGRAMOBJECTARBPROC  glCreateProgramObjectARB  = NULL;
extern PFNGLDELETEOBJECTARBPROC         glDeleteObjectARB         = NULL;
extern PFNGLUSEPROGRAMOBJECTARBPROC     glUseProgramObjectARB     = NULL;
extern PFNGLCREATESHADEROBJECTARBPROC   glCreateShaderObjectARB   = NULL;
extern PFNGLSHADERSOURCEARBPROC         glShaderSourceARB         = NULL;
extern PFNGLCOMPILESHADERARBPROC        glCompileShaderARB        = NULL;
extern PFNGLGETOBJECTPARAMETERIVARBPROC glGetObjectParameterivARB = NULL;
extern PFNGLATTACHOBJECTARBPROC         glAttachObjectARB         = NULL;
extern PFNGLGETINFOLOGARBPROC           glGetInfoLogARB           = NULL;
extern PFNGLLINKPROGRAMARBPROC          glLinkProgramARB          = NULL;
extern PFNGLGETUNIFORMLOCATIONARBPROC   glGetUniformLocationARB   = NULL;
extern PFNGLUNIFORM4FARBPROC            glUniform4fARB            = NULL;
extern PFNGLUNIFORM1IARBPROC            glUniform1iARB            = NULL;
extern PFNGLACTIVETEXTUREPROC			glActiveTexture			  = NULL;

#elif defined(AE_OS_MAC)
//[TODO]: AFAIK, not needed
#endif

/*
** OS Specific windowing context creation - essential for creating the OpenGL drawing context
*/
AESDK_OpenGL_Err AESDK_OpenGL_Startup(AESDK_OpenGL_EffectCommonData& inData)
{
	AESDK_OpenGL_Err result = AESDK_OpenGL_OK;
	inData.mUsingShaderB = false; //default value
	try
	{
#ifdef AE_OS_WIN
		WNDCLASSEX winClass; 
		MSG        uMsg;

		::memset(&uMsg,0,sizeof(uMsg));

		winClass.lpszClassName = "AESDK_OpenGL_Win_Class";
		winClass.cbSize        = sizeof(WNDCLASSEX);
		winClass.style         = CS_HREDRAW | CS_VREDRAW;
		winClass.lpfnWndProc   = ::DefWindowProc;
		winClass.hInstance     = NULL;
		winClass.hIcon	       = NULL;
		winClass.hIconSm	   = NULL;
		winClass.hCursor       = ::LoadCursor(NULL, IDC_ARROW);
		winClass.hbrBackground = (HBRUSH)::GetStockObject(BLACK_BRUSH);
		winClass.lpszMenuName  = NULL;
		winClass.cbClsExtra    = 0;
		winClass.cbWndExtra    = 0;
		
		if( !(::RegisterClassEx(&winClass)) )
			GL_CHECK(AESDK_OpenGL_OS_Load_Err);

		inData.mHWnd = ::CreateWindowEx( NULL, "AESDK_OpenGL_Win_Class", 
								 "OpenGL-using FBOs in AE",
									0,0, 
									0, 50, 50,
									NULL, 
									NULL, 
									NULL,
									NULL	);

		if( inData.mHWnd == NULL )
			GL_CHECK(AESDK_OpenGL_OS_Load_Err);
		
		GLuint PixelFormat;
		PIXELFORMATDESCRIPTOR pfd;
		::ZeroMemory( &pfd, sizeof( pfd ) );

		pfd.nSize      = sizeof(PIXELFORMATDESCRIPTOR);
		pfd.nVersion   = 1;
		pfd.dwFlags    = PFD_DRAW_TO_WINDOW | PFD_SUPPORT_OPENGL | PFD_DOUBLEBUFFER ;
		pfd.iPixelType = PFD_TYPE_RGBA;
		pfd.cColorBits = 32;
		pfd.cDepthBits = 8;
		
		
		inData.mHDC = ::GetDC( inData.mHWnd );
		PixelFormat = ChoosePixelFormat( inData.mHDC, &pfd );
		SetPixelFormat( inData.mHDC, PixelFormat, &pfd);
		
		inData.mHRC = wglCreateContext( inData.mHDC );
		wglMakeCurrent( inData.mHDC, inData.mHRC );

		//check for the appropriate extensions -  EXT_framebuffer_object
		char *ext = (char*)glGetString( GL_EXTENSIONS );
		if( ::strstr( ext, "EXT_framebuffer_object" ) == NULL )
		{		
			GL_CHECK(AESDK_OpenGL_Extensions_Err);
		}
		else
		{
			glIsRenderbufferEXT = (PFNGLISRENDERBUFFEREXTPROC)GetProcAddress("glIsRenderbufferEXT");
			glBindRenderbufferEXT = (PFNGLBINDRENDERBUFFEREXTPROC)GetProcAddress("glBindRenderbufferEXT");
			glDeleteRenderbuffersEXT = (PFNGLDELETERENDERBUFFERSEXTPROC)GetProcAddress("glDeleteRenderbuffersEXT");
			glGenRenderbuffersEXT = (PFNGLGENRENDERBUFFERSEXTPROC)GetProcAddress("glGenRenderbuffersEXT");
			glRenderbufferStorageEXT = (PFNGLRENDERBUFFERSTORAGEEXTPROC)GetProcAddress("glRenderbufferStorageEXT");
			glGetRenderbufferParameterivEXT = (PFNGLGETRENDERBUFFERPARAMETERIVEXTPROC)GetProcAddress("glGetRenderbufferParameterivEXT");
			glIsFramebufferEXT = (PFNGLISFRAMEBUFFEREXTPROC)GetProcAddress("glIsFramebufferEXT");
			glBindFramebufferEXT = (PFNGLBINDFRAMEBUFFEREXTPROC)GetProcAddress("glBindFramebufferEXT");
			glDeleteFramebuffersEXT = (PFNGLDELETEFRAMEBUFFERSEXTPROC)GetProcAddress("glDeleteFramebuffersEXT");
			glGenFramebuffersEXT = (PFNGLGENFRAMEBUFFERSEXTPROC)GetProcAddress("glGenFramebuffersEXT");
			glCheckFramebufferStatusEXT = (PFNGLCHECKFRAMEBUFFERSTATUSEXTPROC)GetProcAddress("glCheckFramebufferStatusEXT");
			glFramebufferTexture1DEXT = (PFNGLFRAMEBUFFERTEXTURE1DEXTPROC)GetProcAddress("glFramebufferTexture1DEXT");
			glFramebufferTexture2DEXT = (PFNGLFRAMEBUFFERTEXTURE2DEXTPROC)GetProcAddress("glFramebufferTexture2DEXT");
			glFramebufferTexture3DEXT = (PFNGLFRAMEBUFFERTEXTURE3DEXTPROC)GetProcAddress("glFramebufferTexture3DEXT");
			glFramebufferRenderbufferEXT = (PFNGLFRAMEBUFFERRENDERBUFFEREXTPROC)GetProcAddress("glFramebufferRenderbufferEXT");
			glGetFramebufferAttachmentParameterivEXT = (PFNGLGETFRAMEBUFFERATTACHMENTPARAMETERIVEXTPROC)GetProcAddress("glGetFramebufferAttachmentParameterivEXT");
			glGenerateMipmapEXT = (PFNGLGENERATEMIPMAPEXTPROC)GetProcAddress("glGenerateMipmapEXT");
			glActiveTexture = (PFNGLACTIVETEXTUREPROC)GetProcAddress("glActiveTexture");

			if( !glIsRenderbufferEXT || !glBindRenderbufferEXT || !glDeleteRenderbuffersEXT || 
				!glGenRenderbuffersEXT || !glRenderbufferStorageEXT || !glGetRenderbufferParameterivEXT || 
				!glIsFramebufferEXT || !glBindFramebufferEXT || !glDeleteFramebuffersEXT || 
				!glGenFramebuffersEXT || !glCheckFramebufferStatusEXT || !glFramebufferTexture1DEXT || 
				!glFramebufferTexture2DEXT || !glFramebufferTexture3DEXT || !glFramebufferRenderbufferEXT||  
				!glGetFramebufferAttachmentParameterivEXT || !glGenerateMipmapEXT || !glActiveTexture)
			{
				GL_CHECK(AESDK_OpenGL_Extensions_Err);
			}
			
		}
		
		char *extP = (char*)glGetString( GL_EXTENSIONS );
		if( ::strstr( extP, "GL_ARB_shading_language_100" ) == NULL )
		{
			//This extension string indicates that the OpenGL Shading Language,
			// version 1.00, is supported.
			GL_CHECK(AESDK_OpenGL_ShaderInit_Err);
		}
	
		//check for the appropriate extensions -  EXT_framebuffer_object
		if( ::strstr( extP, "GL_ARB_shader_objects" ) == NULL )
		{		
			GL_CHECK(AESDK_OpenGL_Extensions_Err);
		}
		else
		{
			glCreateProgramObjectARB  = (PFNGLCREATEPROGRAMOBJECTARBPROC)GetProcAddress("glCreateProgramObjectARB");
			glDeleteObjectARB         = (PFNGLDELETEOBJECTARBPROC)GetProcAddress("glDeleteObjectARB");
			glUseProgramObjectARB     = (PFNGLUSEPROGRAMOBJECTARBPROC)GetProcAddress("glUseProgramObjectARB");
			glCreateShaderObjectARB   = (PFNGLCREATESHADEROBJECTARBPROC)GetProcAddress("glCreateShaderObjectARB");
			glShaderSourceARB         = (PFNGLSHADERSOURCEARBPROC)GetProcAddress("glShaderSourceARB");
			glCompileShaderARB        = (PFNGLCOMPILESHADERARBPROC)GetProcAddress("glCompileShaderARB");
			glGetObjectParameterivARB = (PFNGLGETOBJECTPARAMETERIVARBPROC)GetProcAddress("glGetObjectParameterivARB");
			glAttachObjectARB         = (PFNGLATTACHOBJECTARBPROC)GetProcAddress("glAttachObjectARB");
			glGetInfoLogARB           = (PFNGLGETINFOLOGARBPROC)GetProcAddress("glGetInfoLogARB");
			glLinkProgramARB          = (PFNGLLINKPROGRAMARBPROC)GetProcAddress("glLinkProgramARB");
			glGetUniformLocationARB   = (PFNGLGETUNIFORMLOCATIONARBPROC)GetProcAddress("glGetUniformLocationARB");
			glUniform4fARB            = (PFNGLUNIFORM4FARBPROC)GetProcAddress("glUniform4fARB");
			glUniform1iARB            = (PFNGLUNIFORM1IARBPROC)GetProcAddress("glUniform1iARB");

			if( !glCreateProgramObjectARB || !glDeleteObjectARB || !glUseProgramObjectARB ||
				!glCreateShaderObjectARB || !glCreateShaderObjectARB || !glCompileShaderARB || 
				!glGetObjectParameterivARB || !glAttachObjectARB || !glGetInfoLogARB || 
				!glLinkProgramARB || !glGetUniformLocationARB || !glUniform4fARB ||
				!glUniform1iARB )
			{
				GL_CHECK(AESDK_OpenGL_Extensions_Err);
			}
		}
		
#elif defined(AE_OS_MAC)
		Rect rect;
		SetRect(&rect, 0, 0, 50, 50);
		if ( noErr != CreateNewWindow(kDocumentWindowClass, kWindowStandardDocumentAttributes, &rect, &inData.mMacWnd))
			GL_CHECK(AESDK_OpenGL_OS_Load_Err);
		
		GLint aAttribs[64];
		u_short nIndexS= -1;

		// NO color index support
		aAttribs[++nIndexS]= AGL_RGBA;
		// double buffering
		aAttribs[++nIndexS]=AGL_DOUBLEBUFFER;
	    
		// color
		aAttribs[++nIndexS] = AGL_RED_SIZE;
		aAttribs[++nIndexS] = 8;
		aAttribs[++nIndexS] = AGL_GREEN_SIZE;
		aAttribs[++nIndexS] = 8;
		aAttribs[++nIndexS] = AGL_BLUE_SIZE;
		aAttribs[++nIndexS] = 8;
		aAttribs[++nIndexS] = AGL_ALPHA_SIZE;
		aAttribs[++nIndexS] = 8;
	    
		aAttribs[++nIndexS] = AGL_NONE;

		// get an appropriate pixel format
		AGLPixelFormat oPixelFormat = aglChoosePixelFormat(	NULL,
															0,
															aAttribs);
		if( oPixelFormat == NULL )
			GL_CHECK(AESDK_OpenGL_OS_Load_Err);
	    
		// create the context from the pixel format
		inData.mAGLContext = aglCreateContext(oPixelFormat,NULL);
	    
		if( NULL == inData.mAGLContext )
			GL_CHECK(AESDK_OpenGL_Extensions_Err);
	    
		// otherwise clean-up the pixel format
		aglDestroyPixelFormat(oPixelFormat);

		//attach the window
		if ( !aglSetDrawable (inData.mAGLContext, GetWindowPort(inData.mMacWnd)) )
			GL_CHECK(AESDK_OpenGL_Extensions_Err);

		glFlush();
		aglSetCurrentContext(inData.mAGLContext);
#endif
	}
	catch(AESDK_OpenGL_Err& err)
	{
		result = err;
	}

	return result;
}

/*
** OS Specific unloading
*/
AESDK_OpenGL_Err AESDK_OpenGL_Shutdown(AESDK_OpenGL_EffectCommonData& inData)
{
	AESDK_OpenGL_Err result = AESDK_OpenGL_OK;
	try
	{
#ifdef AE_OS_WIN
		if( inData.mHRC != NULL )
		{
			if(!wglMakeCurrent( NULL, NULL ))
				GL_CHECK(AESDK_OpenGL_OS_Unload_Err);
			if( !wglDeleteContext( inData.mHRC ))
				GL_CHECK(AESDK_OpenGL_OS_Unload_Err);
			inData.mHRC = NULL;
		}

		if( inData.mHDC != NULL )
		{
			ReleaseDC( inData.mHWnd, inData.mHDC );
			inData.mHDC = NULL;
		}
		::UnregisterClass( "AESDK_OpenGL_Win_Class", NULL );
#elif defined(AE_OS_MAC)
		if( GL_FALSE == aglDestroyContext(inData.mAGLContext) )
			GL_CHECK(AESDK_OpenGL_OS_Unload_Err);
		
		DisposeWindow(inData.mMacWnd);
#endif
	}
	catch(AESDK_OpenGL_Err& err)
	{
		result = err;
	}

	return result;
}

/*
** OpenGL resource loading
*/
AESDK_OpenGL_Err AESDK_OpenGL_InitResources(AESDK_OpenGL_EffectCommonData& inData, u_short inBufferWidth, u_short inBufferHeight)
{
	inData.mRenderBufferWidthSu = inBufferWidth;
	inData.mRenderBufferHeightSu = inBufferHeight;
	
	glClearColor( 0.0f, 0.0f, 0.0f, 0.0f );
	glEnable(GL_DEPTH_TEST);

	// Create a frame-buffer object and bind it...
	glGenFramebuffersEXT( 1, &inData.mFrameBufferSu );
		
	// attach renderbuffer to framebuffer
	glEnable(GL_TEXTURE_2D);

	//create the color buffer to render to
	glBindFramebufferEXT(GL_FRAMEBUFFER_EXT, inData.mFrameBufferSu );
	
	//create the depth buffer
	glGenRenderbuffersEXT( 1, &inData.mFrameDepthRenderBufferSu );
	glBindRenderbufferEXT( GL_RENDERBUFFER_EXT, inData.mFrameDepthRenderBufferSu );
	glRenderbufferStorageEXT( GL_RENDERBUFFER_EXT, GL_DEPTH_COMPONENT, inData.mRenderBufferWidthSu, inData.mRenderBufferHeightSu);
	glFramebufferRenderbufferEXT(GL_FRAMEBUFFER_EXT, GL_DEPTH_ATTACHMENT_EXT, GL_RENDERBUFFER_EXT, inData.mFrameDepthRenderBufferSu);
	
	//now create the color render buffer
	glGenRenderbuffersEXT( 1, &inData.mColorRenderBufferSu );
	glBindRenderbufferEXT( GL_RENDERBUFFER_EXT, inData.mColorRenderBufferSu );
	glRenderbufferStorageEXT( GL_RENDERBUFFER_EXT, GL_RGBA, inData.mRenderBufferWidthSu, inData.mRenderBufferHeightSu );
	
	// attach renderbuffer to framebuffer
	glFramebufferRenderbufferEXT(GL_FRAMEBUFFER_EXT, GL_COLOR_ATTACHMENT0_EXT, GL_RENDERBUFFER_EXT, inData.mColorRenderBufferSu);
	
	return AESDK_OpenGL_OK;
}

/*
** OpenGL resource un-loading
*/
AESDK_OpenGL_Err AESDK_OpenGL_ReleaseResources(AESDK_OpenGL_EffectCommonData& inData)
{
	if( inData.mUsingShaderB)
	{
		glDeleteObjectARB( inData.mVertexShaderSu );
		glDeleteObjectARB( inData.mFragmentShaderSu );
		glDeleteObjectARB( inData.mProgramObjSu );
	}

	//release framebuffer resources
	glDeleteFramebuffersEXT( 1, &inData.mFrameBufferSu );
	glDeleteRenderbuffersEXT( 1, &inData.mFrameDepthRenderBufferSu );
	glDeleteRenderbuffersEXT( 1, &inData.mColorRenderBufferSu );

	return AESDK_OpenGL_OK;
}

/*
** Making the FBO surface ready to render
*/
AESDK_OpenGL_Err AESDK_OpenGL_MakeReadyToRender(AESDK_OpenGL_EffectCommonData& inData)
{
	AESDK_OpenGL_Err result = AESDK_OpenGL_OK;
	try
	{	
		// Bind the frame-buffer object and attach to it a render-buffer object set up as a depth-buffer.
		glBindFramebufferEXT( GL_FRAMEBUFFER_EXT, inData.mFrameBufferSu);
			
		// Set the render target - primary surface
		glDrawBuffer(GL_COLOR_ATTACHMENT0_EXT);
		
		if( CheckFramebufferStatus() != string("OK"))
			GL_CHECK(AESDK_OpenGL_Res_Load_Err);
	
	}
	catch(AESDK_OpenGL_Err& err)
	{
		result = err;
	}
	return result;
}

/*
** Initializing the Shader objects
*/
AESDK_OpenGL_Err AESDK_OpenGL_InitShader( AESDK_OpenGL_EffectCommonData& inData, string inVertexShaderFile, string inFragmentShaderFile )
{
	AESDK_OpenGL_Err result = AESDK_OpenGL_OK;
	try
	{
		const char *vertexShaderStringsP[1];
		const char *fragmentShaderStringsP[1];
		GLint vertCompiledB;
		GLint fragCompiledB;
		GLint linkedB;
	    
		// Create the vertex shader...
		inData.mVertexShaderSu = glCreateShaderObjectARB( GL_VERTEX_SHADER_ARB );

		unsigned char* vertexShaderAssemblyP = NULL;
		if(	(vertexShaderAssemblyP = ReadShaderFile( inVertexShaderFile )) == NULL)
			GL_CHECK(AESDK_OpenGL_ShaderInit_Err);

		vertexShaderStringsP[0] = (char*)vertexShaderAssemblyP;
		glShaderSourceARB( inData.mVertexShaderSu, 1, vertexShaderStringsP, NULL );
		glCompileShaderARB( inData.mVertexShaderSu);
		delete vertexShaderAssemblyP;

		glGetObjectParameterivARB( inData.mVertexShaderSu, GL_OBJECT_COMPILE_STATUS_ARB, &vertCompiledB );
		char str[4096];
		if(!vertCompiledB)
		{
			glGetInfoLogARB(inData.mVertexShaderSu, sizeof(str), NULL, str);
			GL_CHECK(AESDK_OpenGL_ShaderInit_Err);
		}

		// Create the fragment shader...
		inData.mFragmentShaderSu = glCreateShaderObjectARB( GL_FRAGMENT_SHADER_ARB );

		unsigned char* fragmentShaderAssemblyP = NULL;
		if(	(fragmentShaderAssemblyP = ReadShaderFile( inFragmentShaderFile )) == NULL)
			GL_CHECK(AESDK_OpenGL_ShaderInit_Err);

		fragmentShaderStringsP[0] = (char*)fragmentShaderAssemblyP;
		glShaderSourceARB( inData.mFragmentShaderSu, 1, fragmentShaderStringsP, NULL );
		glCompileShaderARB( inData.mFragmentShaderSu );
		delete fragmentShaderAssemblyP;

		glGetObjectParameterivARB( inData.mFragmentShaderSu, GL_OBJECT_COMPILE_STATUS_ARB,&fragCompiledB );
		if(!fragCompiledB)
		{
			//glGetInfoLogARB( inData.mFragmentShaderSu, sizeof(str), NULL, str );
			GL_CHECK(AESDK_OpenGL_ShaderInit_Err);
		}

		// Create a program object and attach the two compiled shaders...
		inData.mProgramObjSu = glCreateProgramObjectARB();
		glAttachObjectARB( inData.mProgramObjSu, inData.mVertexShaderSu );
		glAttachObjectARB( inData.mProgramObjSu, inData.mFragmentShaderSu );

		// Link the program object
		glLinkProgramARB( inData.mProgramObjSu );
		glGetObjectParameterivARB( inData.mProgramObjSu, GL_OBJECT_LINK_STATUS_ARB, &linkedB );

		if( !linkedB )
		{
			//glGetInfoLogARB( inData.mProgramObjSu, sizeof(str), NULL, str );
			GL_CHECK(AESDK_OpenGL_ShaderInit_Err);
		}
		else
		{
			inData.mUsingShaderB = true;
		}
	}
	catch(AESDK_OpenGL_Err& err)
	{
		result = err;
	}
	return result;
}

/*
** Start render to shader
*/
void AESDK_OpenGL_StartRenderToShader(AESDK_OpenGL_EffectCommonData& inData)
{
	glUseProgramObjectARB( inData.mProgramObjSu );
}

/*
** Stop render to shader
*/
void AESDK_OpenGL_StopRenderToShader()
{
	glUseProgramObjectARB(NULL);
}

/*
** Bind Texture
*/
AESDK_OpenGL_Err AESDK_OpenGL_BindTextureToTarget(AESDK_OpenGL_EffectCommonData& inData, GLint inTexture, string inTargetName)
{
	AESDK_OpenGL_Err result = AESDK_OpenGL_OK;
	if( inTexture != -1 )
	{
		glActiveTexture( GL_TEXTURE0 );
		glBindTexture( GL_TEXTURE_2D, inTexture );
		glUniform1iARB( glGetUniformLocationARB( inData.mProgramObjSu, inTargetName.c_str()), 0 );
	}
	else
		result = AESDK_OpenGL_ShaderInit_Err;

	return result;
}

/*
** AESDK error reporting
*/
string ReportError( AESDK_OpenGL_Err inError)
{
	//[TODO]: Localize
	switch(inError)
	{
	case 0: return string("OK"); break;
	case 1: return string("OS specific calls failed!"); break;
	case 2: return string("OS specific unloading error!"); break;
	case 3: return string("OpenGL resources failed to load!"); break;
	case 4: return string("OpenGL resources failed to un-load!"); break;
	case 5: return string("Appropriate OpenGL extensions not found!"); break;
	case 6: return string("Shader Error!"); break;
	case 7: return string("Unknown AESDK_OpenGL error!"); break;
	default: return string("Unknown Error Code!");
	}
}

/*
** OpenGL helper function
*/
string CheckFramebufferStatus()
{
    GLenum status;
	status = (GLenum) glCheckFramebufferStatusEXT(GL_FRAMEBUFFER_EXT);
	switch(status)
	{
    case GL_FRAMEBUFFER_COMPLETE_EXT:
		return string("OK");
    case GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT_EXT:
		return string("Framebuffer incomplete, incomplete attachment!");
    case GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT_EXT:
		return string("Framebuffer incomplete, missing attachment!");
    case GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS_EXT:
		return string("Framebuffer incomplete, attached images must have same dimensions!");
    case GL_FRAMEBUFFER_INCOMPLETE_FORMATS_EXT:
		return string("Framebuffer incomplete, attached images must have same format!");
    case GL_FRAMEBUFFER_INCOMPLETE_DRAW_BUFFER_EXT:
		return string("Framebuffer incomplete, missing draw buffer!");
    case GL_FRAMEBUFFER_INCOMPLETE_READ_BUFFER_EXT:
		return string("Framebuffer incomplete, missing read buffer!");
    case GL_FRAMEBUFFER_UNSUPPORTED_EXT:
		return string("Unsupported framebuffer format!");
    }
	return string("Unknown error!");
}

/*
** ReadShaderFile
*/
unsigned char *ReadShaderFile( string inFilename )
{
    FILE *fileP;
	unsigned char *bufferP = NULL;
#ifdef AE_OS_WIN
	fopen_s(&fileP, inFilename.c_str() , "r" );
#elif defined(AE_OS_MAC)
	fileP = fopen( inFilename.c_str() , "r" );
#endif	
	if(NULL != fileP)
	{
		fseek(fileP, 0L, SEEK_END);
		int32_t fileLength = ftell( fileP);
		rewind(fileP);
		bufferP = new unsigned char[fileLength];
		int32_t bytes = static_cast<int32_t>(fread( bufferP, 1, fileLength, fileP ));
		bufferP[bytes] = 0;
	}
		
	return bufferP;
}

} //namespace ends