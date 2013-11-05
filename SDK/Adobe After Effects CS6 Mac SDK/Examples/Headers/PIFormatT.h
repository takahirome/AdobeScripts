/*
	File: PIFormatT.h

	Copyright 1994-99 Adobe Systems, Inc.

	This file describes the time extensions to Adobe's FFM interface.
	
	version 1.1 	clears out the outspec from the platform_info field
					if you specify a null name then the location will be undefined

	version 1.2		new PIModFlag_SAVE_REVERT_INFO flag
					
*/

#ifndef __PIFormatT__
#define __PIFormatT__

#include "PIFormat.h"
#include "FIEL_Public.h"
#include "A.h"



#define 	PI_FORMAT_T_VERSION			1
#define 	PI_FORMAT_T_SUB_VERSION		2

// dimensions of an image when the options
// is meant to be a template and not the
// real thing

#define		PI_FORMAT_T_TPL_X			1
#define 	PI_FORMAT_T_TPL_Y			1

#if WIN32
// dmw -- this needs four-byte alignment (according to the plug-ins I 
// disassembled!)

#pragma pack(push, 4)
#endif

#if PRAGMA_STRUCT_ALIGN
#pragma options align=mac68k
#endif

enum {
	PIModFlag_NONE = 0,
	PIModFlag_INPUT = (1L<<0),						// input module
	PIModFlag_OUTPUT = (1L<<1),						// output module (can be both)
	PIModFlag_FILE = (1L<<2),						// direct correspondence to file in file system
	PIModFlag_STILL = (1L<<3),						// still image support (not VIDEO)
	PIModFlag_VIDEO = (1L<<4),						// multiple image support (not STILL)
	PIModFlag_NO_TIME = (1L<<5),					// time-independent frame-store? always true if STILL; PICS example of non-STILL one
	PIModFlag_INTERACTIVE_GET = (1L<<6),			// user interaction for new seq, required if !FILE & INPUT
	PIModFlag_INTERACTIVE_PUT = (1L<<7),			// user interaction for new out, required if !FILE & OUTPUT
	PIModFlag_MUST_INTERACT_PUT = (1L<<8),			// opts dialog box can't be avoided, even if revertInfo available
	PIModFlag_CAN_ADD_FRAMES_NON_LINEAR = (1L<<9),	// AddFrame can handle non-sequential times
	PIModFlag_NO_OUTPUT_OPTIONS = (1L<<10),			// Options calling sequence does not do anything
	PIModFlag_SAVE_REVERT_INFO = (1L<<11)			// revertInfo is disk safe; store in project. used for 8BIF only, FXIF always saves revertInfo!
};


typedef struct FormatFlags
	{
	A_short	version;
	A_short	subVersion; 
	A_long	flags0;			/* Use PIModFlag here! */
	A_long	flags1;			/* reserved -- set to 0 for now */
	A_long	signature;
	}
FormatFlags;




#define 	PI_FORMAT_T_MESSAGE_LEN		127
#define 	PI_FORMAT_T_NAME_LEN		31


#define		PIAlphaLabel_VERSION		0x0101		

#define		PIAlphaTag					'ALFA'
#define		PIAlphaResID				128


enum {
	formatSelectorSetupPrepare		 = 	 formatSelectorWriteFinish + 1,
	formatSelectorSetupStart,
	formatSelectorSetupContinue,
	formatSelectorSetupFinish,
	
	formatSelectorSetdownPrepare,
	formatSelectorSetdownStart,
	formatSelectorSetdownContinue,
	formatSelectorSetdownFinish,

	formatSelectorStartAddPrepare,
	formatSelectorStartAddStart,
	formatSelectorStartAddContinue,
	formatSelectorStartAddFinish,
	
	formatSelectorEndAddPrepare,
	formatSelectorEndAddStart,
	formatSelectorEndAddContinue,
	formatSelectorEndAddFinish

};

enum {
	PIAlpha_STRAIGHT,
	PIAlpha_PREMUL,
	PIAlpha_IGNORE,
	PIAlpha_NONE

};
typedef A_u_char PIAlphaType;	// this type is not really used, but you're welcome to


enum {
	PIAlphaPremul 		= 0x1,		// otherwise straight
	PIAlphaInverted		= 0x2		//  255 = transparent
};

typedef A_u_long	PIAlphaFlags;

typedef struct {
	A_short					version;
	PIAlphaFlags			flags;
	A_u_char			red;			// color that was matted (if premul)
	A_u_char			green;
	A_u_char			blue;
	PIAlphaType				alpha;
	
} PIAlphaLabel;



typedef struct PITimeRecord
	{
		A_long				value;
		A_u_long		scale;
	}
PITimeRecord;



typedef struct TimeInfo
	{
		A_long			time_info_version;								// hi word is major, lo is sub

		
		/* info returned from all selectors */
		
		A_char			error_msg[PI_FORMAT_T_MESSAGE_LEN+1];			// set to non-null string
																		// when *result is an error code
																		// and the host will bring up an alert
																		// dialog
			
		/*	info returned on the first read */
		
		PITimeRecord	duration;			// duration of the footage
		PITimeRecord	poster_time;		// time-record for "thumbnail"
		Fixed			fixed_fps;			// frames per sec in fixed-point
		
		A_char			read_name[PI_FORMAT_T_NAME_LEN+1];
		A_char			read_message[PI_FORMAT_T_MESSAGE_LEN+1];
											// use this for compressor info, etc.

		A_long			start_smpte_frames;
		A_short			time_base;					// 24, 25, 30, or -30 for dropframe
		A_char			reel_name[16];


		/*	info sent to all reads */

		PITimeRecord	read_time;			// return a frame at this time
		PITimeRecord	read_dur;			// the "shutter duration" of the read
		Rect			read_rect;			// the host's "desired" region of the image
		
		

		/*	info sent back from options sequence */
		
		A_char			write_name[PI_FORMAT_T_NAME_LEN+1];
		A_char			write_message[PI_FORMAT_T_MESSAGE_LEN+1];
		
		/*	info sent to all writes */
		
		Fixed			write_fixed_fps;	// frame rate of output
		PITimeRecord	write_duration;		// maximum possible duration for this output (could be shorter)
		
		A_long			frame_num_to_add;	// which frame is being added (-1 for next)
		A_long			frames_to_add;		// how many frames does this sample last?
		Boolean			was_compressed;		// data has already been compressed/decompressed 
		// CW adds 1 pad byte here
		A_long			origin_h;			// ignored
		A_long			origin_v;			// ignored
		
		PIAlphaLabel	alpha_label;		// alpha information for pixel data sent to write
		FIEL_Label		interlace_label;	// interlace information for write data
	}
TimeInfo, *TimeInfoPtr, **TimeInfoHandle;



typedef struct TimeExtension
	{
	A_long				time_selector;		/* 	this value is the FXIF plug-in selector.
												When the selector parameter to the plug-in's
												entry point is 0, check this value for the
												FXIF selector value. Otherwise, use the
												regular selector value*/
	TimeInfoHandle		time_info;			
	}
TimeExtension;


typedef struct FormatRecordT
	{
	TimeExtension		time_ext;		/* After Effects Time Extension to 8BIF */
	
	//vvp, 6/30/98
	//instead of copying fields of FormatRecord, just add it as a field
 	FormatRecord		format_rec;
 	
 #if 0
	
										/* the remainder of this structure is identical to
											the FormatRecord in Photoshop's 8BIF specification */
	
	A_long				serialNumber;	/* Host's serial number, to allow
										   copy protected plug-in modules. */

	TestAbortProc		abortProc;		/* The plug-in module may call this no-argument
										   BOOLEAN function (using Pascal calling
										   conventions) several times a second during std::int32_t
										   operations to allow the user to abort the operation.
										   If it returns TRUE, the operation should be aborted
										   (and a positive error code returned). */

	ProgressProc		progressProc;	/* The plug-in module may call this two-argument
										   procedure (using Pascal calling conventions)
										   periodically to update a progress indicator.
										   The first parameter (type LONGINT) is the number
										   of operations completed; the second (type LONGINT)
										   is the total number of operations. */

	int32				maxData;		/* Maximum number of bytes that should be
										   passed back at once, plus the size of any
										   interal buffers. The plug-in may reduce this
										   value in the formatSelectorPrepare routine. */

	int32				minDataBytes;	/* Disk space needed for the data fork. */
	int32				maxDataBytes;	/* Disk space needed for the data fork. */

	int32				minRsrcBytes;	/* Disk space needed for the resource fork. */
	int32				maxRsrcBytes;	/* Disk space needed for the resource fork. */

	int32				dataFork;		/* refnum for the data fork. */
	int32				rsrcFork;		/* refnum for the resource fork. */
	
	FSSpec *			fileSpec;		/* Full file specification. */

	A_short				imageMode;		/* Image mode */
	Point				imageSize;		/* Size of image */
	A_short				depth;			/* Bits per sample, currently must be 1 or 8 */
	A_short				planes; 		/* Samples per pixel */

	Fixed				imageHRes;		/* Pixels per inch */
	Fixed				imageVRes;		/* Pixels per inch */

	LookUpTable			redLUT; 		/* Red LUT, only used for Indexed Color images */
	LookUpTable			greenLUT;		/* Green LUT, only used for Indexed Color images */
	LookUpTable			blueLUT;		/* Blue LUT, only used for Indexed Color images */

	void *				data;			/* A pointer to the returned image data. The
										   plug-in module is responsible for freeing
										   this buffer. Should be set to NIL when
										   all the image data has been returned. */

	Rect				theRect;		/* Rectangle being returned */
	A_short				loPlane;		/* First plane being returned */
	A_short				hiPlane;		/* Last plane being returned */
	A_short				colBytes;		/* Spacing between columns */
	A_long				rowBytes;		/* Spacing between rows */
	A_long				planeBytes; 	/* Spacing between planes (ignored if only one
										   plane is returned at a time) */
	PlaneMap			planeMap;		/* Maps plug-in plane numbers to host plane
										   numbers.  The host initializes this is a linear
										   mapping.  The plug-in may change this mapping if
										   it sees the data in a different order. */

	Boolean 			canTranspose;	/* Is the host able to transpose the image? */
	Boolean 			needTranspose;	/* Does the plug-in need the image transposed? */

	OSType				hostSig;		/* Creator code for host application */
	HostProc			hostProc;		/* Host specific callback procedure */

	A_short				hostModes;		/* Used by the host to inform the plug-in which
										   imageMode values it supports.  If the corresponding
										   bit (LSB = bit 0) is 1, the mode is supported. */

	Handle				revertInfo; 	/* Information to be kept with the document for reverting or
										   saving.	Where possible this handle should be used to
										   avoid bringing up an options dialog. */

	NewPIHandleProc		hostNewHdl; 	/* Handle allocation and disposal for revert info. */
	DisposePIHandleProc	hostDisposeHdl;
	
	Handle				imageRsrcData;	/* Handle containing the block of resource data. */
	int32				imageRsrcSize;	/* size of image resources. */

	PlugInMonitor		monitor;		/* The host's monitor. */

	void *				platformData;	/* Platform specific information. */

	BufferProcs *		bufferProcs;	/* The procedures for allocating and */
										/* releasing buffers. */
										
	ResourceProcs *		resourceProcs;	/* Plug-in resource procedures. */

	ProcessEventProc	processEvent;	/* Pass event to the application. */
	
	DisplayPixelsProc	displayPixels;	/* Display dithered pixels. */

	HandleProcs			*handleProcs;	/* Platform independent handle manipulation. */

	OSType				fileType;		/* File-type for filtering */

	ColorServicesProc	colorServices; /* Routine to access color services. */
	
	AdvanceStateProc	advanceState;	/* Valid from continue selectors. */

	A_char				reserved [236]; /* Set to zero */
#endif

	}
FormatRecordT, *FormatRecordTPtr;


#if WIN32
// dmw 
#pragma pack(pop)
#endif

#if PRAGMA_STRUCT_ALIGN
#pragma options align=reset
#endif

#endif
