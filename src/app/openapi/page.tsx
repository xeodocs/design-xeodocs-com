import { OpenAPIViewer } from '@/components/OpenAPIViewer';
import { notFound } from 'next/navigation';
import { getServerConfig, getContentPath } from '@/lib/server-utils';
import SwaggerParser from '@apidevtools/swagger-parser';
import path from 'path';

export const metadata = {
    title: 'OpenAPI Specification - XeoContext',
    description: 'Interactive API documentation',
};

export default async function OpenAPIPage() {
    return null;
}
