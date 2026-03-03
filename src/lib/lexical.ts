interface LexicalNode {
  type: string;
  children?: LexicalNode[];
  text?: string;
  format?: number;
  tag?: string;
  listType?: string;
  url?: string;
  newTab?: boolean;
  direction?: string;
  indent?: number;
  version?: number;
}

interface LexicalContent {
  root?: {
    children?: LexicalNode[];
  };
}

// Lexical text format bitmask flags
const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_UNDERLINE = 8;
const IS_CODE = 16;
const IS_STRIKETHROUGH = 4;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function serializeChildren(children: LexicalNode[]): string {
  return children.map(serializeNode).join('');
}

function serializeNode(node: LexicalNode): string {
  switch (node.type) {
    case 'text': {
      let html = escapeHtml(node.text ?? '');
      const format = node.format ?? 0;
      if (format & IS_BOLD) html = `<strong>${html}</strong>`;
      if (format & IS_ITALIC) html = `<em>${html}</em>`;
      if (format & IS_UNDERLINE) html = `<u>${html}</u>`;
      if (format & IS_STRIKETHROUGH) html = `<s>${html}</s>`;
      if (format & IS_CODE) html = `<code>${html}</code>`;
      return html;
    }

    case 'linebreak':
      return '<br />';

    case 'paragraph':
      return `<p>${node.children ? serializeChildren(node.children) : ''}</p>`;

    case 'heading': {
      const tag = node.tag ?? 'h2';
      return `<${tag}>${node.children ? serializeChildren(node.children) : ''}</${tag}>`;
    }

    case 'link': {
      const target = node.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      const href = node.url ? ` href="${escapeHtml(node.url)}"` : '';
      return `<a${href}${target}>${node.children ? serializeChildren(node.children) : ''}</a>`;
    }

    case 'autolink': {
      const href = node.url ? ` href="${escapeHtml(node.url)}"` : '';
      return `<a${href} target="_blank" rel="noopener noreferrer">${node.children ? serializeChildren(node.children) : ''}</a>`;
    }

    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul';
      return `<${tag}>${node.children ? serializeChildren(node.children) : ''}</${tag}>`;
    }

    case 'listitem':
      return `<li>${node.children ? serializeChildren(node.children) : ''}</li>`;

    case 'quote':
      return `<blockquote>${node.children ? serializeChildren(node.children) : ''}</blockquote>`;

    default:
      // Unknown node type — try to render children if present
      if (node.children) return serializeChildren(node.children);
      return '';
  }
}

export function serializeLexical(content: unknown): string {
  if (!content || typeof content !== 'object') return '';
  const lexical = content as LexicalContent;
  if (!lexical.root?.children) return '';
  return serializeChildren(lexical.root.children);
}
