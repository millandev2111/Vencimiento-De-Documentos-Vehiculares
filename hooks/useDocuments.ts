import { useState, useEffect, useCallback } from 'react';
import type { Document, CreateDocumentDto, DocumentType } from '@/types';
import toast from 'react-hot-toast';

export const useDocuments = (vehicleId?: string) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDocumentTypes = useCallback(async () => {
        try {
            const response = await fetch('/api/document-types');
            const data = await response.json();
            setDocumentTypes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching document types:', err);
        }
    }, []);

    const fetchDocuments = useCallback(async () => {
        if (!vehicleId) return;
        setIsLoading(true);
        try {
            const response = await fetch(`/api/vehicles/${vehicleId}/documents`);
            const data = await response.json();
            setDocuments(Array.isArray(data) ? data : []);
        } catch (err: any) {
            toast.error('Error al cargar documentos');
        } finally {
            setIsLoading(false);
        }
    }, [vehicleId]);

    const addDocument = async (dto: CreateDocumentDto) => {
        try {
            const response = await fetch(`/api/vehicles/${dto.vehicle_id}/documents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dto),
            });
            if (!response.ok) throw new Error('Error al crear documento');
            const newDoc = await response.json();
            setDocuments((prev) => [newDoc, ...prev]);
            toast.success('Documento agregado');
            return newDoc;
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        }
    };

    const deleteDocument = async (docId: string) => {
        try {
            const response = await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar documento');
            setDocuments((prev) => prev.filter((d) => d.id !== docId));
            toast.success('Documento eliminado');
        } catch (err: any) {
            toast.error(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchDocumentTypes();
    }, [fetchDocumentTypes]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    return {
        documents,
        documentTypes,
        isLoading,
        refresh: fetchDocuments,
        addDocument,
        deleteDocument,
    };
};
