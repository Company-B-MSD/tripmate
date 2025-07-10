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
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function SignUpForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    try {
      const response = await api.register({
        username: values.email, // Using email as username
        password: values.password,
        email: values.email,
        name: values.fullName
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      // If registration returns token and user data, login immediately
      if (data.token) {
        login(data.token, data.user);
      } else {
        // If no token returned, just show success and redirect to signin
        toast({ 
          title: 'Account Created!',
          description: 'Please sign in with your new account.'
        });
        navigate('/auth/signin');
        return;
      }
      
      toast({ 
        title: 'Welcome to TripMate!',
        description: 'Your account has been created successfully.'
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignUp = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = getOAuthUrl('google');
  };

  const handleGithubSignUp = () => {
    // Redirect to GitHub OAuth endpoint
    window.location.href = getOAuthUrl('github');
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-primary">Create an Account</CardTitle>
        <CardDescription>Join TripMate and start planning your Sri Lankan adventure!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your Name" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="you@example.com" disabled={isLoading} />
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
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="relative my-6">
          <Separator />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center bg-card px-2">
            <span className="text-sm text-muted-foreground">OR SIGN UP WITH</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={handleGoogleSignUp}
            disabled={isLoading}
          >
            <Chrome className="mr-2 h-4 w-4" /> Google
          </Button>
          <Button 
            variant="outline" 
            onClick={handleGithubSignUp}
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" /> GitHub
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/auth/signin" className="font-medium text-primary hover:underline">Sign In</Link>
        </p>
      </CardFooter>
    </Card>
  );
}