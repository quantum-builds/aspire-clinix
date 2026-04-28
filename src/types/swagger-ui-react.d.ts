// src/types/swagger-ui-react.d.ts
declare module "swagger-ui-react" {
  import React from "react";

  interface SwaggerUIProps {
    spec?: Record<string, any>;
    url?: string;
    layout?: string;
    displayOperationId?: boolean;
    defaultModelsExpandDepth?: number;
    defaultModelExpandDepth?: number;
    docExpansion?: "list" | "full" | "none";
    filter?: boolean | string;
    showExtensions?: boolean;
    showCommonExtensions?: boolean;
  }

  const SwaggerUI: React.FC<SwaggerUIProps>;
  export default SwaggerUI;
}

declare module "swagger-ui-react/swagger-ui.css";
