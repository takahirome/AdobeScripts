
//Must be balanced with PostConfig.h!

#ifdef _WINDOWS
	//disable warning in VS2008 about unbalanced struct alignment changes
	#pragma warning( disable : 4103 )
#endif

//8 byte alignment for adobesdk public files.
#pragma pack( push, AdobeSDKExternalAlign, 8 )
