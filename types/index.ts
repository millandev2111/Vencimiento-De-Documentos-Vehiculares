export type DocumentStatus = 'active' | 'expiring' | 'expired';

export interface DocumentType {
    id: string;
    name: string;
    slug: string;
    duration_months: number;
    icon: string;
    color: string;
    created_at: string;
}

export interface Vehicle {
    id: string;
    plate: string;
    brand: string;
    model: string;
    year: number;
    owner: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    documents?: Document[];
}

export interface Document {
    id: string;
    vehicle_id: string;
    document_type_id: string;
    issue_date: string;
    expiry_date: string;
    file_url: string | null;
    notes: string | null;
    status: DocumentStatus;
    created_at: string;
    updated_at: string;
    document_type?: DocumentType;
    vehicle?: Vehicle;
}

export interface CreateVehicleDto {
    plate: string;
    brand: string;
    model: string;
    year: number;
    owner?: string;
    notes?: string;
}

export interface CreateDocumentDto {
    vehicle_id: string;
    document_type_id: string;
    issue_date: string;
    file_url?: string;
    notes?: string;
}

export interface UpdateDocumentDto {
    issue_date?: string;
    file_url?: string;
    notes?: string;
}

export interface DashboardStats {
    totalVehicles: number;
    totalDocuments: number;
    activeDocuments: number;
    expiringDocuments: number;
    expiredDocuments: number;
}

export interface ExpiringDocument extends Document {
    daysUntilExpiry: number;
    vehicle: Vehicle;
    document_type: DocumentType;
}
