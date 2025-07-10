import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormField,
  FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Github, Chrome, Loader2 } from 'lucide-react';
import { api, getOAuthUrl } from '@/lib/api';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function SignInForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', password: '' },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    try {
      const response = await api.login({
        username: values.username,
        password: values.password,
      });

      const { token, user } = response.data;
      if (token) {
        // Use auth context login method with token and user data
        login(token, user);

        toast({
          title: 'Welcome back!',
          description: 'Successfully signed in to TripMate.',
        });
        navigate('/');
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error(error);
      
      // Better error handling based on response
      let errorMessage = 'Failed to sign in. Please check credentials.';
      if (error.response?.status === 401) {
        errorMessage = 'Invalid username or password.';
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleOAuth = (provider) => {
    window.location.href = getOAuthUrl(provider);
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-primary">Welcome Back!</CardTitle>
        <CardDescription>Sign in to continue to TripMate.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your username" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="••••••••" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>

        <div className="relative my-6">
          <Separator />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center bg-card px-2">
            <span className="text-sm text-muted-foreground">OR CONTINUE WITH</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={() => handleOAuth('google')}
            disabled={isLoading}
          >
            <Chrome className="mr-2 h-4 w-4" /> Google
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleOAuth('github')}
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" /> GitHub
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link to="/auth/signup" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}