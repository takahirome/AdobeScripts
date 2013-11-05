/**************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2009 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains the property of
* Adobe Systems Incorporated  and its suppliers,  if any.  The intellectual 
* and technical concepts contained herein are proprietary to  Adobe Systems 
* Incorporated  and its suppliers  and may be  covered by U.S.  and Foreign 
* Patents,patents in process,and are protected by trade secret or copyright 
* law.  Dissemination of this  information or reproduction of this material
* is strictly  forbidden  unless prior written permission is  obtained from 
* Adobe Systems Incorporated.
**************************************************************************/

/**
	Definition of common types used by adobesdk.
**/

#ifndef ADOBESDK_CONFIG_TYPES_H
#define ADOBESDK_CONFIG_TYPES_H

#include <adobesdk/config/PreConfig.h>

#include "stdint.h"

#ifdef _WINDOWS
	typedef unsigned char	DRAWBOT_Boolean;
#else
	typedef Boolean			DRAWBOT_Boolean;
#endif

typedef uint16_t			DRAWBOT_UTF16Char;

#include <adobesdk/config/PostConfig.h>

#endif //ADOBESDK_CONFIG_TYPES_H
