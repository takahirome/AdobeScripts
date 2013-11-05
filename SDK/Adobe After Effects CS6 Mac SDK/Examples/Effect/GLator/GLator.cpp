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

/*	GLator.cpp	

	This is a sample OpenGL plugin. The framework is done for you.
	Utilize it to create more funky effects.
	
	Revision history: 

	1.0 Win and Mac versions use the same base files.	anindyar	7/4/2007

*/

#include "GLator.h"

#include "GL_base.h"
using namespace AESDK_OpenGL;

//toggle flag to use the GLSL shaders
#define USE_SHADERS 0

//fwd declaring a helper function - to create shader path string
string CreateShaderPath( string inPluginPath, string inShaderFileName );

/* AESDK_OpenGL effect specific variables */
static GLuint S_GLator_InputFrameTextureIDSu; //input texture
static GLuint S_GLator_ReflectionTextureIDSu; //reflection texture
static AESDK_OpenGL::AESDK_OpenGL_EffectCommonData S_GLator_EffectCommonData; //effect state variables
static A_long S_UserPrefKeyValueL;

static PF_Err 
About (	
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	AEGP_SuiteHandler suites(in_data->pica_basicP);
	
	suites.ANSICallbacksSuite1()->sprintf(	out_data->return_msg,
											"%s v%d.%d\r%s",
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
	out_data->my_version = PF_VERSION(	MAJOR_VERSION, 
										MINOR_VERSION,
										BUG_VERSION, 
										STAGE_VERSION, 
										BUILD_VERSION);

	out_data->out_flags = 	PF_OutFlag_I_EXPAND_BUFFER				 |
							PF_OutFlag_I_HAVE_EXTERNAL_DEPENDENCIES;

	out_data->out_flags2 =  PF_OutFlag2_NONE;
	
	//switch off OpenGL previewing
	AEGP_PersistentBlobH	blobH			=	NULL;
	A_Boolean				askB			=	FALSE;
	A_long					offL			=	0,
							defaultL		=	0;
	
	PF_Err err = PF_Err_NONE;
	try
	{
		AEGP_SuiteHandler suites(in_data->pica_basicP);
		ERR(suites.PersistentDataSuite3()->AEGP_GetApplicationBlob(&blobH));
		ERR(suites.PersistentDataSuite3()->AEGP_DoesKeyExist(	blobH,
															"AE_OpenGL",
															"Enabled2",
															&askB));
		
		if (askB)
		{
			//save current preference
			ERR(suites.PersistentDataSuite3()->AEGP_GetLong(blobH,
														"AE_OpenGL",
														"Enabled2",
														defaultL,
														&S_UserPrefKeyValueL));
		}

		//then set our value
		ERR(suites.PersistentDataSuite3()->AEGP_SetLong(blobH,
													"AE_OpenGL",
													"Enabled2",
													offL));


		AESDK_OpenGL_Err error_desc; 
		//Now comes the OpenGL part - OS specific loading to start with
		if( (error_desc = AESDK_OpenGL_Startup(S_GLator_EffectCommonData)) != AESDK_OpenGL_OK)
		{
			PF_SPRINTF(out_data->return_msg, ReportError(error_desc).c_str());
			CHECK(PF_Err_INTERNAL_STRUCT_DAMAGED);
		}
		
		//loading OpenGL resources
		if( (error_desc = AESDK_OpenGL_InitResources(S_GLator_EffectCommonData)) != AESDK_OpenGL_OK)
		{
			PF_SPRINTF(out_data->return_msg, ReportError(error_desc).c_str());
			CHECK(PF_Err_INTERNAL_STRUCT_DAMAGED);
		}

		//GLator effect specific OpenGL resource loading
		//create an empty texture for the input surface
		S_GLator_InputFrameTextureIDSu = -1;
		S_GLator_ReflectionTextureIDSu = -1;

		PF_Handle	dataH	=	suites.HandleSuite1()->host_new_handle(((S_GLator_EffectCommonData.mRenderBufferWidthSu * S_GLator_EffectCommonData.mRenderBufferHeightSu)* sizeof(GL_RGBA)));
		if (dataH)
		{
			unsigned int *dataP = reinterpret_cast<unsigned int*>(suites.HandleSuite1()->host_lock_handle(dataH));
			
			//create empty input frame texture
			glGenTextures( 1, &S_GLator_InputFrameTextureIDSu );
			glBindTexture(GL_TEXTURE_2D, S_GLator_InputFrameTextureIDSu);

			glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);
			glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR);

			glTexImage2D( GL_TEXTURE_2D, 0, 4, S_GLator_EffectCommonData.mRenderBufferWidthSu, S_GLator_EffectCommonData.mRenderBufferHeightSu, 0, GL_RGBA, GL_UNSIGNED_BYTE, dataP);

			//create empty reflection texture
			glGenTextures( 1, &S_GLator_ReflectionTextureIDSu );
			glBindTexture(GL_TEXTURE_2D, S_GLator_ReflectionTextureIDSu);

			glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);
			glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR);

			glTexImage2D( GL_TEXTURE_2D, 0, 4, S_GLator_EffectCommonData.mRenderBufferWidthSu, S_GLator_EffectCommonData.mRenderBufferHeightSu, 0, GL_RGBA, GL_UNSIGNED_BYTE, dataP);

			suites.HandleSuite1()->host_unlock_handle(dataH);
			suites.HandleSuite1()->host_dispose_handle(dataH);
		}
		else
		{
			CHECK(PF_Err_OUT_OF_MEMORY);
		}
#if USE_SHADERS	
		//initialize and compile the shader objects
		A_char pluginFolderPath[AEFX_MAX_PATH];
		PF_GET_PLATFORM_DATA(PF_PlatData_EXE_FILE_PATH, &pluginFolderPath);
		string pluginPath = string(pluginFolderPath);

		if( (error_desc = AESDK_OpenGL_InitShader(	S_GLator_EffectCommonData, 
													CreateShaderPath(pluginPath, string("vertex_shader.vert")),
													CreateShaderPath(pluginPath, string("fragment_shader.frag")) )) != AESDK_OpenGL_OK)
		{
			PF_SPRINTF(out_data->return_msg, ReportError(error_desc).c_str());
			CHECK(PF_Err_INTERNAL_STRUCT_DAMAGED);
		}
#endif //USE_SHADERS

	}
	catch(PF_Err& thrown_err)
	{
		err = thrown_err;
	}
	return err;
}

static PF_Err 
ParamsSetup (	
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	PF_Err		err		= PF_Err_NONE;
	PF_ParamDef	def;	

	AEFX_CLR_STRUCT(def);

	PF_ADD_SLIDER(	STR(StrID_Name), 
					GLATOR_SLIDER_MIN, 
					GLATOR_SLIDER_MAX, 
					GLATOR_SLIDER_MIN, 
					GLATOR_SLIDER_MAX, 
					GLATOR_SLIDER_DFLT,
					SLIDER_DISK_ID);

	out_data->num_params = GLATOR_NUM_PARAMS;

	return err;
}

static PF_Err 
SequenceSetup (	
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	PF_Err			err			=	PF_Err_NONE;
	
	if (in_data->sequence_data){
		PF_DISPOSE_HANDLE(in_data->sequence_data);
	}

	return err;
}

static PF_Err 
SequenceSetdown (
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	PF_Err			err			=	PF_Err_NONE;
	
	AEGP_PersistentBlobH	blobH			=	NULL;
	A_Boolean				askB			=	FALSE;

	try
	{
		//restore user preferences
		AEGP_SuiteHandler suites(in_data->pica_basicP);
		ERR(suites.PersistentDataSuite3()->AEGP_GetApplicationBlob(&blobH));
		ERR(suites.PersistentDataSuite3()->AEGP_DoesKeyExist(	blobH,
															"AE_OpenGL",
															"Enabled2",
															&askB));

		if(askB)
		{
			ERR(suites.PersistentDataSuite3()->AEGP_SetLong(blobH,
														"AE_OpenGL",
														"Enabled2",
														S_UserPrefKeyValueL));
		}
		//local OpenGL resource un-loading
		glDeleteTextures( 1, &S_GLator_InputFrameTextureIDSu);
		glDeleteTextures( 1, &S_GLator_ReflectionTextureIDSu);

		//common OpenGL resource un-loading
		AESDK_OpenGL_Err error_desc;
		if( (error_desc = AESDK_OpenGL_ReleaseResources(S_GLator_EffectCommonData)) != AESDK_OpenGL_OK)
		{
			PF_SPRINTF(out_data->return_msg, ReportError(error_desc).c_str());
			CHECK(PF_Err_INTERNAL_STRUCT_DAMAGED);
		}

		//OS specofic unloading
		if( (error_desc = AESDK_OpenGL_Shutdown(S_GLator_EffectCommonData)) != AESDK_OpenGL_OK)
		{
			PF_SPRINTF(out_data->return_msg, ReportError(error_desc).c_str());
			CHECK(PF_Err_INTERNAL_STRUCT_DAMAGED);
		}

		if (in_data->sequence_data) {
			PF_DISPOSE_HANDLE(in_data->sequence_data);
			out_data->sequence_data = NULL;
		}
	}
	catch(PF_Err& thrown_err)
	{
		err = thrown_err;
	}
	return err;
}


static PF_Err 
SequenceResetup (
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output )
{
	PF_Err err = PF_Err_NONE;
	
	if (!in_data->sequence_data) {
		ERR(SequenceSetup(in_data, out_data, params, output));
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
	PF_Err				err		= PF_Err_NONE;
	AEGP_SuiteHandler	suites(in_data->pica_basicP);

	PF_EffectWorld	openGL_world;
	A_long				widthL	=	output->width,
						heightL	=	output->height;
	
	PF_FpLong sliderVal = params[GLATOR_SLIDER]->u.fd.value / 100.0f;
	
	try
	{
		//setup openGL_world
		AEFX_CLR_STRUCT(openGL_world);	
		ERR(suites.WorldSuite1()->new_world(	in_data->effect_ref,
												widthL,
												heightL,
												PF_NewWorldFlag_CLEAR_PIXELS,
												&openGL_world));

		//update the texture - only a portion of the texture that is
		PF_EffectWorld	*inputP		=	&params[GLATOR_INPUT]->u.ld;
		glEnable( GL_TEXTURE_2D );
			
		PF_Handle bufferH	= NULL;
		bufferH = suites.HandleSuite1()->host_new_handle(((S_GLator_EffectCommonData.mRenderBufferWidthSu * S_GLator_EffectCommonData.mRenderBufferHeightSu)* sizeof(GL_RGBA)));
		if (bufferH)
		{
			unsigned int *bufferP = reinterpret_cast<unsigned int*>(suites.HandleSuite1()->host_lock_handle(bufferH));

			//copy inputframe to openGL_world
			for (int ix=0; ix < inputP->height; ++ix)
			{
				PF_Pixel8 *pixelDataStart = NULL;
				PF_GET_PIXEL_DATA8( inputP , NULL, &pixelDataStart);
				::memcpy(	bufferP + (ix * S_GLator_EffectCommonData.mRenderBufferWidthSu ),
						pixelDataStart + (ix * (inputP->rowbytes)/sizeof(GL_RGBA)),
						inputP->width * sizeof(GL_RGBA));
			}
			
			//upload to texture memory
			glBindTexture(GL_TEXTURE_2D, S_GLator_InputFrameTextureIDSu);
			glTexSubImage2D(GL_TEXTURE_2D, 0, 0, 0, S_GLator_EffectCommonData.mRenderBufferWidthSu, S_GLator_EffectCommonData.mRenderBufferHeightSu, GL_RGBA, GL_UNSIGNED_BYTE, bufferP);
			
			//now create the reflection texture
			for (int ix=0; ix < (inputP->height/2); ++ix)
			{
				PF_Pixel8 *pixelDataStart = NULL;
				PF_GET_PIXEL_DATA8( inputP , NULL, &pixelDataStart);
				::memcpy(	bufferP + (ix * S_GLator_EffectCommonData.mRenderBufferWidthSu ),
				pixelDataStart + ((inputP->height - 1) * (inputP->rowbytes)/sizeof(GL_RGBA)) - (ix * (inputP->rowbytes)/sizeof(GL_RGBA)),
				inputP->width * sizeof(GL_RGBA));

				//reset the Alpha to a curve, row-wise
				for(int jx=0; jx < inputP->width; ++jx)
				{
					
					unsigned int tempPixel = *(bufferP + (ix * S_GLator_EffectCommonData.mRenderBufferWidthSu ) + jx);
					tempPixel = (tempPixel & 0xFFFFFF00) | (AlphaLookup(ix,static_cast<u_int16>(inputP->height/2)));
					memset( (bufferP + (ix * S_GLator_EffectCommonData.mRenderBufferWidthSu ) + jx),
							tempPixel,
							1);
				}
				
			}
			
			//upload to texture memory
			glBindTexture(GL_TEXTURE_2D, S_GLator_ReflectionTextureIDSu);
			glTexSubImage2D(GL_TEXTURE_2D, 0, 0, 0, S_GLator_EffectCommonData.mRenderBufferWidthSu, S_GLator_EffectCommonData.mRenderBufferHeightSu, GL_RGBA, GL_UNSIGNED_BYTE, bufferP);
			
			AESDK_OpenGL_Err error_desc;
			if( (error_desc = AESDK_OpenGL_MakeReadyToRender(S_GLator_EffectCommonData)) != AESDK_OpenGL_OK)
			{
				PF_SPRINTF(out_data->return_msg, ReportError(error_desc).c_str());
				CHECK(PF_Err_INTERNAL_STRUCT_DAMAGED);
			}

			//unbind all textures
			glBindTexture(GL_TEXTURE_2D, 0);

			//set the matrix modes
			glMatrixMode( GL_PROJECTION );
			glLoadIdentity();
			gluPerspective( 45.0, (GLdouble)widthL / heightL, 0.1, 100.0 );
			
			// Set up the frame-buffer object just like a window.
			glViewport( 0, 0, widthL, heightL );
			glClearColor( 0.0f, 0.0f, 0.0f, 0.0f );
			glClear( GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT );
			
			//spin using slider [TODO] as slider control
			glMatrixMode( GL_MODELVIEW );
			glLoadIdentity();
			glTranslatef( 0.0f, 0.0f, -1.3f - (fpshort)sliderVal );
			
			glBindTexture( GL_TEXTURE_2D, S_GLator_InputFrameTextureIDSu );
			if( S_GLator_EffectCommonData.mUsingShaderB )
			{
				AESDK_OpenGL_StartRenderToShader(S_GLator_EffectCommonData);

				// Identify the texture to use and bind it to texture unit 0
				if( (error_desc = AESDK_OpenGL_BindTextureToTarget(S_GLator_EffectCommonData, S_GLator_InputFrameTextureIDSu, string("videoTexture"))) != AESDK_OpenGL_OK)
				{
					PF_SPRINTF(out_data->return_msg, ReportError(error_desc).c_str());
					CHECK(PF_Err_INTERNAL_STRUCT_DAMAGED);
				}
			}
			else
			{
				glBindTexture( GL_TEXTURE_2D, S_GLator_InputFrameTextureIDSu );
			}
			
			//Render the geometry to the frame-buffer object
			fpshort yOffsetF = -0.10f;
			fpshort aspectF = (static_cast<fpshort>(widthL))/heightL;
			glBegin(GL_QUADS); //input frame
				glTexCoord2f(0.0f,0.0f);	glVertex3f(-0.5f * aspectF,-0.5f + yOffsetF,0.0f);
				glTexCoord2f(0.7f,0.0f);	glVertex3f(0.5f * aspectF,-0.5f + yOffsetF,0.0f);
				glTexCoord2f(0.7f,0.46f);	glVertex3f(0.5f * aspectF,0.5f + yOffsetF,0.0f);
				glTexCoord2f(0.0f,0.46f);	glVertex3f(-0.5f * aspectF,0.5f + yOffsetF,0.0f);
			glEnd();
			
			if( S_GLator_EffectCommonData.mUsingShaderB )
			{
				// Identify the texture to use and bind it to texture unit 0
				if( (error_desc = AESDK_OpenGL_BindTextureToTarget(S_GLator_EffectCommonData, S_GLator_ReflectionTextureIDSu, string("videoTexture"))) != AESDK_OpenGL_OK)
				{
					PF_SPRINTF(out_data->return_msg, ReportError(error_desc).c_str());
					CHECK(PF_Err_INTERNAL_STRUCT_DAMAGED);
				}
			}
			else
			{
				glBindTexture( GL_TEXTURE_2D, S_GLator_ReflectionTextureIDSu );
			}
			

			glBegin(GL_QUADS); //reflected quad
				glTexCoord2f(0.0f,0.23f);	glVertex3f(-0.5f * aspectF,1.0f + yOffsetF,0.0f);
				glTexCoord2f(0.7f,0.23f);	glVertex3f(0.5f * aspectF,1.0f + yOffsetF,0.0f);
				glTexCoord2f(0.7f,0.0f);	glVertex3f(0.5f * aspectF,0.5f + yOffsetF,0.0f);
				glTexCoord2f(0.0f,0.0f);	glVertex3f(-0.5f * aspectF,0.5f + yOffsetF,0.0f);
			glEnd();
		
			if( S_GLator_EffectCommonData.mUsingShaderB )
			{
				AESDK_OpenGL_StopRenderToShader();
			}

			glFlush();	
			
			// Check for errors...
			string error_msg;
			if( (error_msg = CheckFramebufferStatus()) != string("OK"))
			{
				PF_SPRINTF(out_data->return_msg, error_msg.c_str());
				CHECK(PF_Err_INTERNAL_STRUCT_DAMAGED);
			}
			glFlush();
			
			//download from texture memory onto the same surface
			glReadBuffer(GL_COLOR_ATTACHMENT0_EXT);
			glReadPixels(0, 0, S_GLator_EffectCommonData.mRenderBufferWidthSu, S_GLator_EffectCommonData.mRenderBufferHeightSu, GL_RGBA, GL_UNSIGNED_BYTE, bufferP);
			
			//copy to openGL_world
			for (int ix=0; ix < openGL_world.height; ++ix)
			{
				PF_Pixel8 *pixelDataStart = NULL;
				PF_GET_PIXEL_DATA8( &openGL_world , NULL, &pixelDataStart);
				::memcpy(	pixelDataStart + (ix * openGL_world.rowbytes/sizeof(GL_RGBA)),
						bufferP + (ix * S_GLator_EffectCommonData.mRenderBufferWidthSu ),
						openGL_world.width * sizeof(GL_RGBA));
			}
			
			//clean the data after being copied
			suites.HandleSuite1()->host_unlock_handle(bufferH);
			suites.HandleSuite1()->host_dispose_handle(bufferH);
		}
		else
		{
			CHECK(PF_Err_OUT_OF_MEMORY);
		}
		
		if (PF_Quality_HI == in_data->quality) {
			ERR(suites.WorldTransformSuite1()->copy_hq(	in_data->effect_ref,
														&openGL_world,
														output,
														NULL,
														NULL));
		}
		else
		{
			ERR(suites.WorldTransformSuite1()->copy(	in_data->effect_ref,
														&openGL_world,
														output,
														NULL,
														NULL));

		}
		
		ERR( suites.WorldSuite1()->dispose_world( in_data->effect_ref, &openGL_world));
		ERR(PF_ABORT(in_data));
	}
	catch(PF_Err& thrown_err)
	{
		err = thrown_err;
	}
	return err;
}

DllExport	
PF_Err 
EntryPointFunc (
	PF_Cmd			cmd,
	PF_InData		*in_data,
	PF_OutData		*out_data,
	PF_ParamDef		*params[],
	PF_LayerDef		*output,
	void			*extra)
{
	PF_Err		err = PF_Err_NONE;
	
	try {
		switch (cmd) {
			case PF_Cmd_ABOUT:
				err = About(in_data,
							out_data,
							params,
							output);
				break;
				
			case PF_Cmd_GLOBAL_SETUP:
				err = GlobalSetup(	in_data,
									out_data,
									params,
									output);
				break;
				
			case PF_Cmd_PARAMS_SETUP:
				err = ParamsSetup(	in_data,
									out_data,
									params,
									output);
				break;
				
			case PF_Cmd_RENDER:
				err = Render(		in_data,
								out_data,
								params,
								output);
				break;

			case PF_Cmd_SEQUENCE_SETUP:
				err = SequenceSetup(	in_data,
										out_data,
										params,
										output);
				break;
			case PF_Cmd_SEQUENCE_SETDOWN:
				err = SequenceSetdown(	in_data,
										out_data,
										params,
										output);
				break;
			case PF_Cmd_SEQUENCE_RESETUP:
				err = SequenceResetup(	in_data,
										out_data,
										params,
										output);
				break;
					
		}
	}
	catch(PF_Err &thrown_err){
		err = thrown_err;
	}
	return err;
}

//helper function
string CreateShaderPath( string inPluginPath, string inShaderFileName )
{
	string::size_type pos;
	string shaderPath;
#ifdef AE_OS_WIN
	//delete the plugin name
	pos = inPluginPath.rfind("\\",inPluginPath.length());
	shaderPath = inPluginPath.substr( 0, pos);
	shaderPath = shaderPath + string("\\") + inShaderFileName;
#elif defined(AE_OS_MAC)
	//delete the plugin name
	pos = inPluginPath.rfind(":",inPluginPath.length());
	shaderPath = inPluginPath.substr( 0, pos);
	//delete the parent volume
	pos = shaderPath.find_first_of( string(":"), 0);
	shaderPath.erase( 0, pos);
	//next replace all the colons with slashes
	while( string::npos != (pos = inPluginPath.find( string(":"), 0)) )
	{
		shaderPath.replace(pos, 1, string("/"));
	}
	shaderPath = shaderPath + string("/") + inShaderFileName;
#endif
	return shaderPath;
}