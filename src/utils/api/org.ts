import http from '@/utils/axios';

interface List {
  id: number;
  created_at: number;
  updated_at: number;
  org_id: number;
  user_id: number;
  member_type: number;
  status: number;
}

export interface OrgList {
  id: number;
  created_at: number;
  updated_at: number;
  name: string;
  member: List[];
}

export const getOrgList = (): Promise<OrgList[]> => {
  return http.get("orgs")
}

