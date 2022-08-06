import http from "@/utils/axios";
import { getOriIdByContext } from "@/utils/utils";

export enum HealthStatus {
  HEALTHY = "Healthy",
  PROGRESSING = "Progressing",
  DEGRADED = "Degraded",
  SUSPENDED = "Suspended",
  MISSING = "Missing",
  UNKNOWN = "Unknown",
}

export enum SyncStatus {
  SYNCED = "Synced",
  OUT_OF_SYNC = "OutOfSync",
}

export interface GetArgoCDInfoReq {
  app_id: number;
  env_id: number;
}

export interface GetArgoCDInfoRes {
  space: {
    syncPolicy: {
      automated?: any;
      syncOptions: Array<string>;
    };
    source: {
      helm: {
        valueFiles: Array<string>;
      };
      path: string;
      repoURL: string;
      targetRevision: string;
    };
  };
  status: {
    health: {
      status: HealthStatus;
    };
    operationState: {
      finishedAt: Date;
      message: string;
      operation: any;
      phase: "Succeeded" | string;
      startedAt: Date;
      syncResult: {
        resources: Array<any>;
        revision: string;
        source: any;
      };
    };
    sync: {
      comparedTo: any;
      revision: string;
      status: SyncStatus;
    };
  };
}
export function getArgoCDInfo(
  req: GetArgoCDInfoReq
): Promise<GetArgoCDInfoRes> {
  return http.get(
    `/orgs/${getOriIdByContext()}/applications/${req.app_id}/envs/${
      req.env_id
    }/argocd_info`
  );
}

// getArgoCDInfo return example
const a = {
  space: {
    destination: {
      namespace: "forkmain-main",
      server: "https://kubernetes.default.svc",
    },
    project: "default",
    source: {
      helm: {
        valueFiles: ["values.yaml"],
      },
      path: "forkmain",
      repoURL: "https://github.com/h8r-dev/forkmain-deploy",
      targetRevision: "HEAD",
    },
    syncPolicy: {
      automated: {},
      syncOptions: ["CreateNamespace=true"],
    },
  },
  status: {
    health: {
      status: "Healthy",
    },
    history: [
      {
        deployStartedAt: "2022-08-04T04:19:08Z",
        deployedAt: "2022-08-04T04:19:10Z",
        id: 76,
        revision: "6d0e0a958086f0c6330b9335176359cb63476af7",
        source: {
          helm: {
            valueFiles: ["values.yaml"],
          },
          path: "forkmain",
          repoURL: "https://github.com/h8r-dev/forkmain-deploy",
          targetRevision: "HEAD",
        },
      },
    ],
    operationState: {
      finishedAt: "2022-08-04T04:19:11Z",
      message: "successfully synced (all tasks run)",
      operation: {
        initiatedBy: {
          automated: true,
        },
        retry: {
          limit: 5,
        },
        sync: {
          revision: "6d0e0a958086f0c6330b9335176359cb63476af7",
          syncOptions: ["CreateNamespace=true"],
        },
      },
      phase: "Succeeded",
      startedAt: "2022-08-04T04:19:08Z",
      syncResult: {
        resources: [
          {
            group: "monitoring.coreos.com",
            hookPhase: "Running",
            kind: "PrometheusRule",
            message:
              "prometheusrule.monitoring.coreos.com/heighliner-cloud-backend unchanged",
            name: "heighliner-cloud-backend",
            namespace: "forkmain-main",
            status: "Synced",
            syncPhase: "Sync",
            version: "v1",
          },
        ],
        revision: "6d0e0a958086f0c6330b9335176359cb63476af7",
        source: {
          helm: {
            valueFiles: ["values.yaml"],
          },
          path: "forkmain",
          repoURL: "https://github.com/h8r-dev/forkmain-deploy",
          targetRevision: "HEAD",
        },
      },
    },
    reconciledAt: "2022-08-04T04:21:34Z",
    resources: [
      {
        kind: "Secret",
        name: "postgresql",
        namespace: "forkmain-main",
        status: "Synced",
        version: "v1",
      },
      {
        health: {
          status: "Healthy",
        },
        kind: "Service",
        name: "heighliner-cloud-backend",
        namespace: "forkmain-main",
        status: "Synced",
        version: "v1",
      },
      {
        health: {
          status: "Healthy",
        },
        kind: "Service",
        name: "heighliner-cloud-frontend",
        namespace: "forkmain-main",
        status: "Synced",
        version: "v1",
      },
      {
        health: {
          status: "Healthy",
        },
        kind: "Service",
        name: "postgresql",
        namespace: "forkmain-main",
        status: "Synced",
        version: "v1",
      },
      {
        health: {
          status: "Healthy",
        },
        kind: "Service",
        name: "postgresql-hl",
        namespace: "forkmain-main",
        status: "Synced",
        version: "v1",
      },
      {
        kind: "ServiceAccount",
        name: "heighliner-cloud-backend",
        namespace: "forkmain-main",
        status: "Synced",
        version: "v1",
      },
      {
        kind: "ServiceAccount",
        name: "heighliner-cloud-frontend",
        namespace: "forkmain-main",
        status: "Synced",
        version: "v1",
      },
      {
        group: "apps",
        health: {
          status: "Healthy",
        },
        kind: "Deployment",
        name: "heighliner-cloud-backend",
        namespace: "forkmain-main",
        status: "Synced",
        version: "v1",
      },
      {
        group: "apps",
        health: {
          status: "Healthy",
        },
        kind: "Deployment",
        name: "heighliner-cloud-frontend",
        namespace: "forkmain-main",
        status: "Synced",
        version: "v1",
      },
      {
        group: "apps",
        health: {
          message:
            "partitioned roll out complete: 1 new pods have been updated...",
          status: "Healthy",
        },
        kind: "StatefulSet",
        name: "postgresql",
        namespace: "forkmain-main",
        status: "Synced",
        version: "v1",
      },
      {
        group: "bitnami.com",
        health: {
          status: "Healthy",
        },
        kind: "SealedSecret",
        name: "forkmain",
        namespace: "forkmain-main",
        status: "Synced",
        version: "v1alpha1",
      },
      {
        group: "monitoring.coreos.com",
        kind: "PrometheusRule",
        name: "heighliner-cloud-backend",
        namespace: "forkmain-main",
        status: "Synced",
        version: "v1",
      },
      {
        group: "networking.k8s.io",
        health: {
          status: "Healthy",
        },
        kind: "Ingress",
        name: "heighliner-cloud-backend",
        namespace: "forkmain-main",
        status: "Synced",
        version: "v1",
      },
      {
        group: "networking.k8s.io",
        health: {
          status: "Healthy",
        },
        kind: "Ingress",
        name: "heighliner-cloud-frontend",
        namespace: "forkmain-main",
        status: "Synced",
        version: "v1",
      },
    ],
    sourceType: "Helm",
    summary: {
      externalURLs: [
        "http://forkmain-qrl4fz4x9.forkmain.cloud/",
        "http://forkmain-qrl4fz4x9.forkmain.cloud/api(/|$)(.*)",
      ],
      images: [
        "docker.io/bitnami/postgresql:14.4.0-debian-11-r11",
        "ghcr.io/h8r-dev/heighliner-cloud-backend:54ea6ca",
        "ghcr.io/h8r-dev/heighliner-cloud-frontend:main",
      ],
    },
    sync: {
      comparedTo: {
        destination: {
          namespace: "forkmain-main",
          server: "https://kubernetes.default.svc",
        },
        source: {
          helm: {
            valueFiles: ["values.yaml"],
          },
          path: "forkmain",
          repoURL: "https://github.com/h8r-dev/forkmain-deploy",
          targetRevision: "HEAD",
        },
      },
      revision: "6d0e0a958086f0c6330b9335176359cb63476af7",
      status: "Synced",
    },
  },
};

export interface UpdateArgoCDInfoReq extends GetArgoCDInfoReq {
  body: Pick<GetArgoCDInfoRes, "space">;
}

export function updateArgoCDInfo(req: UpdateArgoCDInfoReq) {
  return http.put(
    `/orgs/${getOriIdByContext()}/applications/${req.app_id}/envs/${
      req.env_id
    }/argocd_info`,
    req.body
  );
}
