/* stdint.h
************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2002 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and may be covered by U.S. and Foreign Patents,
* patents in process, and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
--------------------------------------------------------------------------
	Standard Integer definitions
	
	Modeled after, but not completely conforming to the C99 spec.
	Recommended by the Architects council.
	Provided for use with Microsoft Visual C and C++ 
	environments.

	author: nstratto@adobe.com

**************************************************************************/
#ifndef	_ADOBE_STDINT_H_
#define	_ADOBE_STDINT_H_

#include <limits.h>
#include <stddef.h>


// [NOTE] _WIN32 defines the target API, not architechture.
// This check says this file is Windows only and nothing about bit depth.
#if	_WIN32
#else
#error	ERROR: Only Win32 target supported!
#endif

/* Exact Width Integers
***********************************/
typedef signed char			int8_t;
typedef short int			int16_t;
typedef long int			int32_t;
typedef signed __int64		int64_t;

typedef	unsigned char		uint8_t;
typedef	unsigned short int	uint16_t;
typedef unsigned long int	uint32_t;
typedef unsigned __int64	uint64_t;

#if !defined(__cplusplus)
#ifndef INT8_MIN
	#define INT8_MIN		SCHAR_MIN
	#define INT16_MIN		SHRT_MIN
	#define INT32_MIN		LONG_MIN
	#define INT64_MIN		LLONG_MIN

	#define INT8_MAX		SCHAR_MAX
	#define INT16_MAX		SHRT_MAX
	#define INT32_MAX		LONG_MAX
	#define INT64_MAX		LLONG_MAX

	#define UINT8_MAX		UCHAR_MAX
	#define UINT16_MAX		USHRT_MAX
	#define UINT32_MAX		ULONG_MAX
	#define UINT64_MAX		ULLONG_MAX
#endif	// ndef INT8_MIN
#endif	// !defined(__cplusplus)


/* Minumum Width Integers
************************************************/
typedef signed char			int_least8_t;
typedef	short int			int_least16_t;
typedef	long int			int_least32_t;
typedef signed __int64		int_least64_t;

typedef	unsigned char		uint_least8_t;
typedef unsigned short int  uint_least16_t;
typedef unsigned long int   uint_least32_t;
typedef unsigned __int64	uint_least64_t;

#if !defined(__cplusplus)
#ifndef	INT_LEAST8_MIN
	#define INT_LEAST8_MIN		SCHAR_MIN
	#define INT_LEAST16_MIN		SHRT_MIN
	#define INT_LEAST32_MIN		LONG_MIN
	#define INT_LEAST64_MIN		LLONG_MIN

	#define INT_LEAST8_MAX		SCHAR_MAX
	#define INT_LEAST16_MAX		SHRT_MAX
	#define INT_LEAST32_MAX		LONG_MAX
	#define INT_LEAST64_MAX		LLONG_MAX

	#define UINT_LEAST8_MAX		UCHAR_MAX
	#define UINT_LEAST16_MAX	USHRT_MAX
	#define UINT_LEAST32_MAX	ULONG_MAX
	#define UINT_LEAST64_MAX	ULLONG_MAX
#endif	// ndef INT_LEAST_MIN
#endif	// !defined(__cplusplus)

/* Fastest Minimum Width Integers
***********************************************/
typedef signed char 		int_fast8_t;
typedef short int   		int_fast16_t;
typedef long int    		int_fast32_t;
typedef signed __int64		int_fast64_t;

typedef unsigned char		uint_fast8_t;
typedef unsigned short int  uint_fast16_t;
typedef unsigned long int   uint_fast32_t;
typedef unsigned __int64	uint_fast64_t;

#if !defined(__cplusplus)
#ifndef	INT_FAST8_MIN	
	#define INT_FAST8_MIN		SCHAR_MIN
	#define INT_FAST16_MIN		SHRT_MIN
	#define INT_FAST32_MIN		LONG_MIN
	#define INT_FAST64_MIN		LLONG_MIN

	#define INT_FAST8_MAX		SCHAR_MAX
	#define INT_FAST16_MAX		SHRT_MAX
	#define INT_FAST32_MAX		LONG_MAX
	#define INT_FAST64_MAX		LLONG_MAX

	#define UINT_FAST8_MAX		UCHAR_MAX
	#define UINT_FAST16_MAX		USHRT_MAX
	#define UINT_FAST32_MAX		ULONG_MAX
	#define UINT_FAST64_MAX		ULLONG_MAX
#endif	// ndef INT_FAST8_MIN
#endif	// !defined(__cplusplus)

/* Integer Types for holding object pointers
**********************************************/
#ifdef	_INTPTR_T_DEFINED	// stddef.h defines these for us, but not in the standard namespace
	typedef intptr_t			intptr_t;
	typedef uintptr_t			uintptr_t;
#else
	#ifdef  _WIN64
		typedef int64_t				intptr_t;
		typedef uint64_t			uintptr_t;
	#else
		typedef int32_t				intptr_t;
		typedef uint32_t			uintptr_t;
	#endif
#endif



#if !defined(__cplusplus)
#ifndef	INTPTR_MIN
	#define INTPTR_MIN			LONG_MIN
	#define INTPTR_MAX			LONG_MAX
	#define UINTPTR_MAX			ULONG_MAX
#endif	// ndef INTPTR_MIN
#endif	// !defined(__cplusplus)

/* Integer Types of greatest Width
**********************************************/
typedef int64_t				intmax_t;
typedef uint64_t			uintmax_t;

#if !defined(__cplusplus)
#ifndef	INTMAX_MIN
	#define INTPTR_MIN			LONG_MIN
	#define INTPTR_MAX			LONG_MAX
	#define UINTPTR_MAX			ULONG_MAX
#endif	// ndef INTMAX_MIN
#endif	// !defined(__cplusplus)

/* Macros for Defining Constants
**********************************************/
#if !defined(__cplusplus)
#ifndef INT8_C
	#define INT8_C(value)		value
	#define	INT16_C(value)		value
	#define	INT32_C(value)		value ## L
	#define INT64_C(value)		value ## LL
	#define UINT8_C(value)		value ## U
	#define UINT16_C(value)		value ## U
	#define UINT32_C(value)		value ## UL
	#define UINT64_C(value)		value ## ULL
	#define INTMAX_C(value)		value ## LL
	#define UINTMAX_C(value)	value ## ULL
#endif	// end ifndef INT8_C
#endif	// !defined(__cplusplus)


#endif		// _ADOBE_STDINT_H_
