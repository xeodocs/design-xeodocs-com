import { AsyncAPIViewer } from '@/components/AsyncAPIViewer';
import { notFound } from 'next/navigation';
import { getServerConfig, getContentPath } from '@/lib/server-utils';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import path from 'path';

export const metadata = {
    title: 'AsyncAPI Specification - XeoContext',
    description: 'Event-driven architecture documentation',
};

export default async function AsyncAPIPage() {
    return null;
}
