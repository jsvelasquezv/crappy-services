import factoryWithDB from '../factories/app-with-db';
import { v7 as uuidv7 } from 'uuid';
import { media } from '../db/schema';
import { eq, sql, desc } from 'drizzle-orm';

const app = factoryWithDB.createApp();

app.post('/', async (c) => {
  const body = await c.req.formData();
  const file = body.get('file') as File;
  const title = body.get('title') as string;
  const tags = body.getAll('tags') as string[];

  if (!file) {
    return c.json({ error: 'No file provided' }, 400);
  }

  const r2 = c.env.R2_BUCKET;
  const fileExtension = file.name.split('.').pop() || 'unknown';
  const id = uuidv7();
  const fileName = `${id}.${fileExtension}`;

  try {
    await r2.put(fileName, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    const db = c.get('db');
    await db
      .insert(media)
      .values({
        id,
        fileName,
        originalName: file.name,
        title: title || null,
        tags: tags.length > 0 ? tags : null,
        fileSize: file.size,
        mimeType: file.type,
      })
      .returning();

    return c.json({
      id,
      fileName,
      size: file.size,
      type: file.type,
      title,
      tags,
    });
  } catch (error) {
    return c.json({ error: 'Upload failed' }, 500);
  }
});

app.get('/', async (c) => {
  const searchTerm = c.req.query('q');
  const limitParam = c.req.query('limit');
  const offsetParam = c.req.query('offset');

  const limit = limitParam ? parseInt(limitParam) : 10;
  const offset = offsetParam ? parseInt(offsetParam) : 0;

  if (limit < 1 || limit > 100) {
    return c.json({ error: 'Limit must be between 1 and 100' }, 400);
  }

  if (offset < 0) {
    return c.json({ error: 'Offset must be 0 or greater' }, 400);
  }

  const db = c.get('db');

  try {
    const query = db.select().from(media);

    // If search term provided, filter by tags and title
    if (searchTerm) {
      query.where(
        sql`(
          ${media.tags} LIKE ${'%' + searchTerm + '%'} OR 
          ${media.title} LIKE ${'%' + searchTerm + '%'}
        )`
      );
    }

    const results = await query
      .orderBy(desc(media.createdAt))
      .limit(limit)
      .offset(offset);

    return c.json({
      searchTerm: searchTerm || null,
      limit,
      offset,
      count: results.length,
      results: results.map((record) => ({
        id: record.id,
        fileName: record.fileName,
        originalName: record.originalName,
        title: record.title,
        tags: record.tags,
        fileSize: record.fileSize,
        mimeType: record.mimeType,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      })),
    });
  } catch (error) {
    return c.json({ error: 'Failed to retrieve media' }, 500);
  }
});

app.get('/:id', async (c) => {
  const id = c.req.param('id');
  const db = c.get('db');

  try {
    const [mediaRecord] = await db.select().from(media).where(eq(media.id, id));

    if (!mediaRecord) {
      return c.json({ error: 'File not found' }, 404);
    }

    return c.json({
      id: mediaRecord.id,
      fileName: mediaRecord.fileName,
      originalName: mediaRecord.originalName,
      title: mediaRecord.title,
      tags: mediaRecord.tags,
      fileSize: mediaRecord.fileSize,
      mimeType: mediaRecord.mimeType,
      createdAt: mediaRecord.createdAt,
      updatedAt: mediaRecord.updatedAt,
    });
  } catch (error) {
    return c.json({ error: 'Failed to retrieve metadata' }, 500);
  }
});

export default app;
