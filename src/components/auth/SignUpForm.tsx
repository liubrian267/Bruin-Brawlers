"use client";

import { useState, useActionState } from "react";
import { User, Lock, Star } from "lucide-react";
import Link from "next/link";
import { signUp } from "@/app/(auth)/signUp/action";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [brawlId, setBrawlId] = useState("");
  const [state, signUpAction, signUpPending] = useActionState(
    signUp,
    undefined
  );

  return (
    <div className="bg-white dark:bg-gray-800/90 p-8 rounded-xl shadow-md w-full max-w-md backdrop-blur-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-ucla-blue dark:text-[#4A9EDE]">
        Join Bruin Brawlers
      </h2>
      <form action={signUpAction}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Brawl Stars ID
          </label>
          <div className="relative">
            <Star
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={20}
            />
            <input
              type="BrawlID"
              name="BrawlID"
              id="ID"
              value={brawlId}
              onChange={(e) => setBrawlId(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-ucla-blue dark:focus:ring-[#4A9EDE]"
              placeholder="Enter your Brawl Stars ID (no #)"
              required
            />
          </div>
          {state?.errors?.BrawlID && (
            <p className="mt-2 text-red-500 dark:text-red-400">{state.errors.BrawlID}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={20}
            />
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-ucla-blue dark:focus:ring-[#4A9EDE]"
              placeholder="Enter your email"
              required
            />
          </div>
          {state?.errors?.email && (
            <p className="mt-2 text-red-500 dark:text-red-400">{state.errors.email}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={20}
            />
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-ucla-blue dark:focus:ring-[#4A9EDE]"
              placeholder="Enter your password"
              required
            />
          </div>
          {state?.errors?.password && (
            <p className="text-red-500 dark:text-red-400">{state.errors.password}</p>
          )}
        </div>
        <button
          disabled={signUpPending}
          type="submit"
          className="w-full bg-ucla-blue hover:bg-[#1e5c8c] dark:bg-[#2774AE] dark:hover:bg-[#1e5c8c] text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link href="./login" className="text-ucla-blue hover:text-[#1e5c8c] dark:text-[#4A9EDE] dark:hover:text-[#6AB3E7] hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
