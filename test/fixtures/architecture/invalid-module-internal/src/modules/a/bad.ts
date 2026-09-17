import { internalOnly } from "../b/internal";

export function bad(): string {
  return internalOnly();
}
