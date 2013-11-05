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

#include "Supervisor.h"
	
typedef struct {
	unsigned long	index;
	char			str[256];
} TableString;



TableString		g_strs[StrID_NUMTYPES] = {
	StrID_NONE,					"",
	StrID_Name,					"Supervisor",
	StrID_Description,			"Demonstrates parameter supervision. Also, dig the whizzy seperators in the 'Flavor' pop-up!",

	StrID_ModeName,				"Mode",
	StrID_ModeChoices,			"Basic|"
								"Advanced", 

	StrID_FlavorName,			"Flavor",		
	StrID_FlavorChoices,		"Chocolate|"
								"(-|"
								"Strawberry|"
								"(-|"
								"Sherbet",
	StrID_FlavorChoicesChanged,	"Chocolate|"
								"(-|"
								"Strawberry|"
								"(-|"
								"And more!",

	StrID_ColorName,			"Color",

	StrID_SliderName,			"Slider", 

	StrID_CheckboxName,			"Checkbox", 
	StrID_CheckboxCaption,		"Set slider to 50%", 
	
	StrID_Err_LoadSuite,		"Couldn't acquire suite.", 
	StrID_Err_FreeSuite,		"Couldn't free suite.",

	StrID_TopicName,			"Details", 
	StrID_TopicNameDisabled,	"(Disabled while Basic)",
	StrID_FlavorNameDisabled,	"Flavor (disabled in Basic mode)",

	StrID_GeneralError,			"Error handling Changed Param."
};

char	*GetStringPtr(int strNum)
{
	return g_strs[strNum].str;
}
