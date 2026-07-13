import type { FastifyRequest } from 'fastify';

export type UploadedFile = {
  buffer: Buffer;
  originalname: string;
};

/** Parse a multipart request into a plain fields object and, if present, the uploaded file under the given field name */
export async function parseMultipartRequest(
  request: FastifyRequest,
  fileFieldName: string
): Promise<{ fields: { [key: string]: unknown }; file: undefined | UploadedFile }> {
  const fields: { [key: string]: unknown } = {};
  let file: undefined | UploadedFile;

  for await (const part of request.parts()) {
    if (part.type === 'file') {
      if (part.fieldname === fileFieldName) {
        file = { buffer: await part.toBuffer(), originalname: part.filename };
      }
      continue;
    }

    const existing = fields[part.fieldname];
    if (Array.isArray(existing)) {
      existing.push(part.value);
    } else if (existing !== undefined) {
      fields[part.fieldname] = [existing, part.value];
    } else {
      fields[part.fieldname] = part.value;
    }
  }

  return { fields, file };
}
