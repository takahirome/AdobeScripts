/* R_O_I_Strings.cpp */

#include "R_O_I.h"

typedef struct {
	unsigned long	index;
	char			str[256];
} TableString;

TableString		g_strs[StrID_NUMTYPES] = {
	StrID_NONE,						"",
	StrID_Name,						"R_O_I",
	StrID_Description,				"A SmartFX-ified exercise of our processing callbacks.\nCopyright 2007 Adobe Systems Incorporated.",
	StrID_Color_Param_Name,			"Color to mix",
	StrID_Rect_Size_Param_Name,		"Size of Rect",
	StrID_Checkbox_Param_Name,		"Use Downsample Factors",
	StrID_Checkbox_Description,		"(important!)",
	StrID_DependString1,			"All Dependencies requested.",
	StrID_DependString2,			"Missing Dependencies requested.",
	StrID_Err_LoadSuite,			"Error loading suite.",
	StrID_Err_FreeSuite,			"Error releasing suite.",
	StrID_Popup_Choices,			"Old Skool|New Skool|(-|Alpha Ignant",
	StrID_Popup_Param_Name,			"Kick it..."
};


char *GetStringPtr(int strNum)
{
	return g_strs[strNum].str;
}
	