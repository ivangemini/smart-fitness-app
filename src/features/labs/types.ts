export type LabDocumentStatus =
  | 'pending_upload'
  | 'uploaded'
  | 'processing'
  | 'review_required'
  | 'confirmed'
  | 'failed';

export type LabSemanticState =
  | 'unknown'
  | 'in_range'
  | 'borderline'
  | 'out_of_range'
  | 'significantly_out_of_range';

export type LabReviewState = 'unreviewed' | 'accepted' | 'corrected' | 'excluded';

export type LabCapabilitiesDto = {
  uploadConfigured: boolean;
  processingAvailable: boolean;
  importAvailable: boolean;
  reviewRequired: true;
};

export type LabReferenceIntervalDto = {
  low: number | null;
  high: number | null;
  unit: string;
};

export type LabDocumentDto = {
  id: string;
  status: LabDocumentStatus;
  fileName: string;
  mediaType: string;
  byteSize: number;
  uploadExpiresAt: string | null;
  uploadedAt: string | null;
  collectedAt: string | null;
  pageCount: number | null;
  failureCode: string | null;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
};

export type LabResultDraftDto = {
  id: string;
  sourceIndex: number;
  sourceLabel: string;
  sourceValue: number;
  sourceUnit: string;
  sourceReferenceText: string | null;
  referenceInterval: LabReferenceIntervalDto | null;
  confidence: {
    marker: number;
    value: number;
    unit: number;
    referenceInterval: number | null;
  };
  normalized: {
    markerId: string;
    value: number;
    unit: string;
  } | null;
  semanticState: LabSemanticState;
  reviewState: LabReviewState;
};

export type LabResultDto = {
  id: string;
  documentId: string;
  markerId: string;
  value: number;
  unit: string;
  sourceValue: number;
  sourceUnit: string;
  referenceInterval: LabReferenceIntervalDto | null;
  semanticState: LabSemanticState;
  collectedAt: string;
};

export type LabPanelComparisonState =
  | 'new'
  | 'stable'
  | 'classification_improved'
  | 'classification_worsened'
  | 'not_comparable';

export type LabPanelResultSnapshotDto = {
  markerId: string;
  value: number;
  unit: string;
  semanticState: LabSemanticState;
  referenceInterval: LabReferenceIntervalDto | null;
  collectedAt: string;
};

export type LabPanelComparisonDto = {
  previousDocumentId: string;
  currentDocumentId: string;
  previousCollectedAt: string;
  currentCollectedAt: string;
  interpretation: 'classification_movement_only';
  items: Array<{
    markerId: string;
    state: LabPanelComparisonState;
    previous: LabPanelResultSnapshotDto | null;
    current: LabPanelResultSnapshotDto;
  }>;
};

export type LabInterpretationFindingKind =
  | 'reference_context'
  | 'trend_context'
  | 'data_quality_context';

export type LabInterpretationFindingDto = {
  kind: LabInterpretationFindingKind;
  markerIds: string[];
  summary: string;
  confidence: number;
  sourceDocumentIds: string[];
  sourceMarkerIds: string[];
};

export type LabInterpretationDto = {
  runId: string;
  contextVersion: number;
  output: {
    version: 1;
    provider: string;
    model: string;
    findings: LabInterpretationFindingDto[];
  };
};

export type LabReviewBundleDto = {
  document: LabDocumentDto;
  results: LabResultDraftDto[];
};

export type LabUploadEnvelope = {
  document: LabDocumentDto;
  upload: {
    method: 'PUT';
    url: string;
    headers: Readonly<Record<string, string>>;
    expiresAt: string;
  };
};
