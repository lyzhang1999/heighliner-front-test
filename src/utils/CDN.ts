/**
 * All resources store in the CDN
 */

import { ClusterProvider } from "./api/cluster";

export const GinIcon =
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Gin%403x.webp";
export const NextIcon =
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Nextjs%403x.webp";
export const SpringIcon =
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Spring%403x.webp";
export const VueIcon =
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Vue%403x.webp";
export const RemixIcon =
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Remix%403x.webp";

export const KubernetesIcon =
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/kubernetes%403x.webp";
export const AwsIcon =
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/aws.webp";
export const ShapeLogo =
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/shape-logo.png";
/**
 *
 * @param provider Cluster Provider
 * @returns
 */
export function getClusterIcon(provider: ClusterProvider) {
  switch (provider) {
    case ClusterProvider.Kubeconfig:
      return KubernetesIcon;
    case ClusterProvider.AWS:
      return AwsIcon;
    case ClusterProvider.Free:
      return ShapeLogo;
    default:
      return "";
  }
}

export const PlusIcon =
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/plus.svg";
