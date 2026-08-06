import Link from 'next/link';
import { useRouter, usePathname, redirect } from 'next/navigation';

export const locales = ['pt'] as const;
export const defaultLocale = 'pt';

export { Link, redirect, usePathname, useRouter };
