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

#include "Easy_Cheese.h"

typedef struct {
	unsigned long	index;
	char			str[256];
} TableString;

TableString		g_strs[StrID_NUMTYPES] = {
	StrID_NONE,							"",
	StrID_Name,							"Easy Cheese",
	StrID_Description,					"Keyframer plug-in.Copyright 1994-2005 Adobe Systems Incorporated.",
	StrID_MarkerText,					"Easy Cheese was here.",
	StrID_URL,							"http://www.adobe.com",
	StrID_Chapter,						"chapter %d",
	StrID_SuiteError,					"Error acquiring suite."
	
};


char	*GetStringPtr(int strNum)
{
	return g_strs[strNum].str;
}
	