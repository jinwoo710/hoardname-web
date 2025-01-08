'use client'

import { useSession } from 'next-auth/react'
import { FormEvent, useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function Email() {
  const [loading, setLoading] = useState(false)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        if (emailRef.current && session.user?.email) {
          emailRef.current.value = session.user.email
        }
        
        try {
          const response = await fetch('/api/user/check') 
          const data = await response.json() as { hasNickname: boolean, nickname: string }
          
          if (nameRef.current) {
            nameRef.current.value = data.nickname || ''
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
          if (nameRef.current) {
            nameRef.current.value = ''
          }
        }
      }
    }

    fetchUserData()
  }, [session])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)


    
    
    try {
      const response = await fetch(`https://script.google.com/macros/s/AKfycbymRuUlzDFIM_YW9AnIBLY8a04gSANtFmhVemHHtFnohD7_23YdLoz78JlbXaHeqXywAg/exec`, {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json() as { result: string }
      setLoading(false)
      
      if (data.result === 'success') {
        toast.success("문의가 성공적으로 접수되었습니다.")
        if (messageRef.current) {
    messageRef.current.value = ''
  }
      } else {
        toast.error("전송에 실패하였습니다. 다시 시도해주세요.")
      }
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
      toast.error(`전송 중 오류가 발생하였습니다. 관리자에게 문의주세요. 에러코드:${error}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
  
           <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold text-gray-800">버그 및 문의하기</h1>
        
            </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                    <ul className='text-sm text-gray-600 space-y-1.5'>
                     <li>버그 및 페이지와 관련된 문의는 언제든 환영입니다.</li>
          
                        <li>등록하고 싶은 게임이 검색이 안되는 케이스도 문의주세요.</li>
                </ul>
                </div>
      <form onSubmit={handleSubmit} data-email="travachess@gmail.com" className="bg-white relative shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
             {loading && (
        <div className="text-center py-4 absolute left-1/2 top-1/3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
        </div>
      )}
        <fieldset>
         <div className="mb-6">
              <label htmlFor="userName" className="block text-gray-700 text-sm font-bold mb-2">
                닉네임 (<span className='text-red-500'>*</span>)
              </label>
            <input ref={nameRef} type="text" id="userName" name="name"   className="shadow-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="닉네임" required />
          </div> 
     <div className="mb-6">
              <label htmlFor="userEmail" className="block text-gray-700 text-sm font-bold mb-2">
                이메일
              </label>
            <input ref={emailRef} type="email" id="userEmail" name="email"   className="shadow-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="이메일" />
          </div> 
                <div className="mb-6">
              <label htmlFor="userMessage" className="block text-gray-700 text-sm font-bold mb-2">
                내용 (<span className='text-red-500'>*</span>)
              </label>
            <textarea  ref={messageRef} name="message" id="userMessage"  className="shadow-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] resize-none" required></textarea>
          </div>
          <button type="submit"  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
            {loading ? '제출 중...' : '제출하기'}
          </button>
        </fieldset>
      </form>
    </div>
  )
}
