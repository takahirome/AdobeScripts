/***********************************************************************/
/*                                                                     */
/* SPFiles.h                                                           */
/*                                                                     */
/* Copyright 1995-2006 Adobe Systems Incorporated.                     */
/* All Rights Reserved.                                                */
/*                                                                     */
/* Patents Pending                                                     */
/*                                                                     */
/* NOTICE: All information contained herein is the property of Adobe   */
/* Systems Incorporated. Many of the intellectual and technical        */
/* concepts contained herein are proprietary to Adobe, are protected   */
/* as trade secrets, and are made available only to Adobe licensees    */
/* for their internal use. Any reproduction or dissemination of this   */
/* software is strictly forbidden unless prior written permission is   */
/* obtained from Adobe.                                                */
/*                                                                     */
/***********************************************************************/

#ifndef __SPFiles__
#define __SPFiles__


/*******************************************************************************
 **
 **	Imports
 **
 **/

#include "SPTypes.h"
#include "SPProps.h"

#ifdef __cplusplus
extern "C" {
#endif


/*******************************************************************************
 **
 ** Constants
 **
 **/
/** Files suite name */
#define kSPFilesSuite				"SP Files Suite"
/** Files suite version */
#define kSPFilesSuiteVersion		3

/** PICA global list of potential plug-in files. .
	@see \c #SPRuntimeSuite::GetRuntimeFileList().*/
#define kSPRuntimeFileList			((SPFileListRef)NULL)

/** Return value for \c #SPFilesSuite::GetFilePropertyList(),
	indicating that the file has no property list. */
#define kFileDoesNotHavePiPL		(SPPropertyListRef)((intptr_t)-1)
/** Return value for \c #SPFilesSuite::GetFilePropertyList(),
	indicating that the file has multiple property lists. <<is this right? how do you retrieve them?>> */
#define kFileHasMulitplePiPLs		NULL

/*******************************************************************************
 **
 ** Types
 **
 **/

/** The maximum number of characters allowed in a file path specification. */
#define kMaxPathLength 300

/** Opaque reference to a file. Access with the \c #SPFilesSuite. */
typedef struct SPFile *SPFileRef;
/** Opaque reference to a file list. Access with the \c #SPFilesSuite. */
typedef struct SPFileList *SPFileListRef;
/** Opaque reference to a file-list iterator. Access with the \c #SPFilesSuite. */
typedef struct SPFileListIterator *SPFileListIteratorRef;
/** Opaque reference to a platform-specific file specification. Access with the \c #SPFilesSuite. */
typedef struct OpaqueSPPlatformFileRef SPPlatformFileRef;


#ifdef MAC_ENV
#if PRAGMA_STRUCT_ALIGN		// DRSWAT
#pragma options align=mac68k
#endif


/** A file specification:
		\li In Mac OS, a path string and a FSRef.
		\li In Windows, a path string. */
typedef struct SPPlatformFileSpecification {
	unsigned char path[kMaxPathLength];
	FSRef mReference;
} SPPlatformFileSpecification;

typedef struct SPPlatformFileSpecificationW {	/* this handles unicode file names */
	FSRef mReference;
} SPPlatformFileSpecificationW;

#if PRAGMA_STRUCT_ALIGN	// DRSWAT
#pragma options align=reset
#endif

/** Platform-specific file metadata. */
typedef struct SPPlatformFileInfo {	 /* On Mac OS*/
	/** Not used. */
	unsigned int attributes; 	//Unused, but still required to maintain binary compatibility
	/** Date file was created (Mac OS). */
	unsigned int creationDate;
	/** Data file was last modified (Mac OS). */
	unsigned int modificationDate;
	/** Type of file for Finder (Mac OS). */
	unsigned int finderType;
	/** File creator (Mac OS). */
	unsigned int finderCreator;
	/** File flags for Finder; see Mac OS documentation. */
	unsigned short finderFlags;
} SPPlatformFileInfo;
#endif


#ifdef WIN_ENV
/** A file specification in Windows. */
typedef struct SPPlatformFileSpecification {
	/** The file path string. */
	char path[kMaxPathLength];
} SPPlatformFileSpecification;

/** A widechar file specification in Windows to handle unicode file names. */
typedef struct SPPlatformFileSpecificationW {
	/** mReference could be as long as 64K but MUST be NULL terminated. */
	unsigned short *mReference;
} SPPlatformFileSpecificationW;

/**Platform-specific file metadata. */
typedef struct SPPlatformFileInfo {
	/** File attribute flags; see Windows documentation. */
	unsigned int attributes;
	/** Least-significant byte of the file creation date-time (Windows).*/
	unsigned int lowCreationTime;
	/** Most-significant byte of the file creation date-time (Windows).*/
	unsigned int highCreationTime;
	/** Least-significant byte of the file modification date-time (Windows).*/
	unsigned int lowModificationTime;
	/** Most-significant byte of the file cremodification date-time (Windows).*/
	unsigned int highModificationTime;
	/** The file-name extension indicating the file type (Windows). */
	const char *extension;
} SPPlatformFileInfo;
#endif

/** Internal */
typedef SPBoolean (*SPAddPiPLFilterProc)( SPPlatformFileInfo *info );

/*******************************************************************************
 **
 ** Suite
 **
 **/
/** @ingroup Suites
	This suite allows you to access the PICA files list. This list, created at startup,
    contains references to every file in the application's plug-in folder, including
    any resolved file and folder aliases. PICA maintains this list, and uses it to find plug-ins.

    Use this suite to access the plug-in file list, in order to avoid redundant directory
    scans. Adapters looking for their own plug-ins and PICA plug-ins looking for
    support files should scan the list to locate relevant files rather than walking
    platform directory  structures on their own.

	Similarly, you can use this suite to create, maintain, and access your own lists
	of files in a platform-independant and efficient manner.

	\li Acquire this suite using \c #SPBasicSuite::AcquireSuite() with the constants
		\c #kSPFilesSuite and \c #kSPFilesSuiteVersion.
    */
typedef struct SPFilesSuite {
	/** Creates a new file list. Typically, you use the main PICA file list to access
		plug-in files, available through \c #SPRuntimeSuite::GetRuntimeFileList().
		You can use this to track other file collections. If you create a new list, you
		must free it when it is no longer needed, using \c #FreeFileList().
			@param fileList [out] A buffer in which to return the new file list object.
		*/
	SPAPI SPErr (*AllocateFileList)( SPFileListRef *fileList );
	/** Frees a file list created with \c #AllocateFileList(), and any entries in the list.
			@param fileList The file list object.
		*/
	SPAPI SPErr (*FreeFileList)( SPFileListRef fileList );

	/** Adds a file or all files in a directory to a file list. Searches a directory
		recursively for contained files.
			@param fileList The file list object.
			@param file The file or directory specification.
		*/
	SPAPI SPErr (*AddFiles)( SPFileListRef fileList, const SPPlatformFileSpecification *file );

	/** Creates a file-list iterator object to use with \c #NextFile() for iterating
		through a file list. The iterator is initially set to the first file in the list.
		When the iterator is no longer needed, free it with \c #DeleteFileListIterator().
			@param fileList The file list object.
			@param iter [out] A buffer in which to return the new iterator object.
		*/
	SPAPI SPErr (*NewFileListIterator)( SPFileListRef fileList, SPFileListIteratorRef *iter );
	/** Retrieves the current file from a file list iterator, and advances the iterator.
			@param iter The iterator object.
			@param file [out] A buffer in which to return the current file object, or \c NULL
				if the end of the list has been reached.
		*/
	SPAPI SPErr (*NextFile)( SPFileListIteratorRef iter, SPFileRef *file );
	/** Frees a file-list iterator created with /c #NewFileListIterator().
			@param iter The iterator object.
		*/
	SPAPI SPErr (*DeleteFileListIterator)( SPFileListIteratorRef iter );

	/** Retrieves the platform-specific file specification for a file.
			@param file The file object.
			@param fileSpec [out] A buffer in which to return the file specification.
		*/
	SPAPI SPErr (*GetFileSpecification)( SPFileRef file, SPPlatformFileSpecification *fileSpec );
	/** Retrieves the  metadata for a file.
			@param file The file object.
			@param info [out] A buffer in which to return the file information.
		*/
	SPAPI SPErr (*GetFileInfo)( SPFileRef file, SPPlatformFileInfo *info );

	/** Reports whether a file in a file list is a plug-in.
			@param file The file object.
			@param isAPlugin [out] A buffer in which to return true if the file is a plug-in.
		*/
	SPAPI SPErr (*GetIsAPlugin)( SPFileRef file, SPBoolean *isAPlugin );
	/** Sets whether a file in a file list is a plug-in.
			@param file The file object.
			@param isAPlugin True to mark the file as a plug-in, false to mark it as not a plug-in.
		*/
	SPAPI SPErr (*SetIsAPlugin)( SPFileRef file, SPBoolean isAPlugin );

	/** Retrieves the property list for a file.
			@param file The file object.
			@param propertList [out] A buffer in which to return the property list,
				or \c #kFileDoesNotHavePiPL if the file does not have a property list,
				or \c #kFileHasMulitplePiPLs if the file has multiple property lists.
			@see \c SPPiPL.h
		*/
	SPAPI SPErr (*GetFilePropertyList)( SPFileRef file, SPPropertyListRef *propertList );
	/** Sets the property list for a file.
			@param file The file object.
			@param propertList The new property list.
		*/
	SPAPI SPErr (*SetFilePropertyList)( SPFileRef file, SPPropertyListRef propertList );

} SPFilesSuite;


/** Internal */
SPAPI SPErr SPAllocateFileList( SPFileListRef *fileList );
/** Internal */
SPAPI SPErr SPFreeFileList( SPFileListRef fileList );
/** Internal */
SPAPI SPErr SPAddFiles( SPFileListRef fileList, const SPPlatformFileSpecification *file );

/** Internal */
SPAPI SPErr SPNewFileListIterator( SPFileListRef fileList, SPFileListIteratorRef *iter );
/** Internal */
SPAPI SPErr SPNextFile( SPFileListIteratorRef iter, SPFileRef *file );
/** Internal */
SPAPI SPErr SPDeleteFileListIterator( SPFileListIteratorRef iter );

/** Internal */
SPAPI SPErr SPGetFileSpecification( SPFileRef file, SPPlatformFileSpecification *fileSpec );
/** Internal */
SPAPI SPErr SPGetFileInfo( SPFileRef file, SPPlatformFileInfo *info );
/** Internal */
SPAPI SPErr SPGetIsAPlugin( SPFileRef file, SPBoolean *isAPlugin );
/** Internal */
SPAPI SPErr SPSetIsAPlugin( SPFileRef file, SPBoolean isAPlugin );

/** Internal */
SPAPI SPErr SPGetFilePropertyList( SPFileRef file, SPPropertyListRef *propertList );
/** Internal */
SPAPI SPErr SPSetFilePropertyList( SPFileRef file, SPPropertyListRef propertList );

/** Internal */
SPAPI SPErr SPAddFilePiPLs( SPFileListRef fileList, SPAddPiPLFilterProc filter );

/*******************************************************************************
 **
 **	Errors
 **
 **/

#include "SPErrorCodes.h"

#ifdef __cplusplus
}
#endif

#endif
