#ifndef _AE_STRUCT_SIZE_ASSERT_H_PART_1_
#define _AE_STRUCT_SIZE_ASSERT_H_PART_1_
	#ifdef AE_PROC_INTELx64
		#define DISK_PTR64(type, name)	\
			type	*name

		#define PI_DISK_PTR64(type, name)	\
			type	*name
	#else
		#define DISK_PTR64(type, name)	\
			type	*name;				\
			int32_t	name##_pad

		// this is the same as above but uses int32 instead of int32_t
		// for the padding.  used by the format plugins because of a type
		// conflict with PS public headers.  --jgn 4/29/09
		#define PI_DISK_PTR64(type, name)	\
			type	*name;				\
			int32	name##_pad
	#endif
#endif // _AE_STRUCT_SIZE_ASSERT_H_PART_1_

#ifdef __cplusplus
	#ifndef _AE_STRUCT_SIZE_ASSERT_H_PART_2_
	#define _AE_STRUCT_SIZE_ASSERT_H_PART_2_
		//
		// Provides a convenient way to make sure the size of a public or disk structure doesn't change
		// without you knowing it. To use, put:
		// 
		//		AE_STRUCT_SIZE_ASSERT(MyStructType, 0) after the structure
		//
		// definition. When you go to compile you will get an error, and the message will tell you
		// the real size of the structure. Change the 0 to that size and your compile will succeed.
		// Now if anyone inadvertently changes the size of the structure (including obtusely, like
		// by changing alignments through a header or compiler switch), it will fail to compile
		// and they will have to think about what they did.
		//

		template <bool x, int real_size> struct AE_STRUCT_SIZE_ASSERTION_FAILURE;

		template <int real_size> struct AE_STRUCT_SIZE_ASSERTION_FAILURE<true, real_size> { enum { value = 1 }; };

		template<bool x> struct ae_struct_size_assert_test{};

		#define AE_STRUCT_SIZE_ASSERT( _STRUCT, _SIZE )		\
			typedef ae_struct_size_assert_test<\
				sizeof(AE_STRUCT_SIZE_ASSERTION_FAILURE< (bool)( sizeof(_STRUCT) == (_SIZE) ), sizeof(_STRUCT) >)\
			> ae_struct_size_assert_test_typedef_


		//
		// Provides a convenient way to make sure the offset of a public or disk structure member doesn't change
		// without you knowing it. To use, put:
		// 
		//		AE_STRUCT_OFFSET_ASSERT(MyStructType, MyStructTypeMember, 0) after the structure
		//
		// definition. When you go to compile you will get an error, and the message will tell you
		// the real offset of the structure's member. Change the 0 to that offset and your compile will succeed.
		// Now if anyone inadvertently changes the offset of the member (including obtusely, like
		// by changing alignments through a header or compiler switch), it will fail to compile
		// and they will have to think about what they did.
		//

		template <bool x, int offset> struct AE_STRUCT_OFFSET_ASSERTION_FAILURE;								//forward declared template structure	when (false, offset)

		template <int offset> struct AE_STRUCT_OFFSET_ASSERTION_FAILURE<true, offset> { enum { value = 1 }; };	//implemented template structure		when (true, offset)

		template<bool x> struct ae_struct_offset_assert_test{};							//wrapper

		#define AE_STRUCT_OFFSET_ASSERT( _STRUCT, _MEMBER, _OFFSET) \
			typedef ae_struct_offset_assert_test<\
				sizeof(AE_STRUCT_OFFSET_ASSERTION_FAILURE< (bool)( offsetof(_STRUCT, _MEMBER) == (_OFFSET) ), offsetof(_STRUCT, _MEMBER) >)\
			> ae_struct_offset_assert_test_typedef_

		//
		// Explanation of implementation: AE_STRUCT_OFFSET_ASSERTION_FAILURE is defined as either a forward declaration, or { enum { value = 1 }; }.
		// Taking the sizeof a forward declared struct causes a compile time failure, whereas the latter will compile.
		// Template specialization is used to determine if AE_STRUCT_OFFSET_ASSERTION_FAILURE is a forward declaration or defined. 
		// If the internal == test passed in as an argument is false the forward declared template is used causing an error. 
		// If the test is true, the specialized template is used and the expression is valid.
		// ae_struct_offset_assert_test is just a template that wraps the others neatly. 
		// The second parameter given to AE_STRUCT_OFFSET_ASSERTION_FAILURE is the value that gets displayed in the compile error (which is the actual offset).
		//

	#endif // _AE_STRUCT_SIZE_ASSERT_H_PART_2_
#endif
