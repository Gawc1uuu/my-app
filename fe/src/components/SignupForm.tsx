import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { supabase } from '@/lib/supabaseClient'
import { FormEvent, useState } from 'react'

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null)


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })

        if (error) {
            setErrorMsg(error.message)
        } else {
            console.log('Sign-up successful', data)
        }
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <form onSubmit={handleSubmit}>
                <Card className='w-full max-w-sm'>
                    <CardHeader>
                        <CardTitle className='text-2xl'>Register</CardTitle>
                        <CardDescription>Enter email and password to login into your accout</CardDescription>
                    </CardHeader>
                    <CardContent className='grid gap-4'>
                        <div className='grid gap-2'>
                            <Label>Email</Label>
                            <Input type='email' onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='grid gap-2'>
                            <Label>Password</Label>
                            <Input type='password' onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className='flex flex-col w-full text-center gap-2'>
                            <Button className='w-full'>
                                Sign up
                            </Button>
                            {errorMsg && (
                                <p className='text-red-500'>{errorMsg}</p>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}

export default SignupForm