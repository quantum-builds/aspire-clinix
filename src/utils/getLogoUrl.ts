export function getLogoUrl(): string {
  const region = process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION;
  const bucketName = process.env.AWS_BUCKET_NAME || process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  const logoKey = "uploads/aspire-clinic/images/aspire-logo.png"

  console.log("logo url ", `https://${bucketName}.s3.${region}.amazonaws.com/${logoKey}`)
  return `https://${bucketName}.s3.${region}.amazonaws.com/${logoKey}`;
}