export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'project': return 'bg-opal-primary/15 text-opal-primary border border-opal-primary/30';
    case 'optimization': return 'bg-success/15 text-success border border-success/30';
    case 'leadership': return 'bg-opal-accent/15 text-opal-accent border border-opal-accent/30';
    case 'architecture': return 'bg-warning/15 text-warning border border-warning/30';
    // NotePostModal용 매핑
    case 'work': return 'bg-opal-primary/15 text-opal-primary border border-opal-primary/30';
    case 'experience': return 'bg-opal-accent/15 text-opal-accent border border-opal-accent/30';
    default: return 'bg-surface-secondary text-foreground-secondary border border-border';
  }
};

export const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'project': return 'Project';
    case 'optimization': return 'Optimization';
    case 'leadership': return 'Leadership';
    case 'architecture': return 'Architecture';
    // NotePostModal용 매핑
    case 'work': return 'Work';
    case 'experience': return 'Experience';
    default: return category;
  }
};

export const getNotesPageCategories = () => [
  { key: 'all', label: 'All' },
  { key: 'project', label: 'Project' },
  { key: 'optimization', label: 'Optimization' },
  { key: 'leadership', label: 'Leadership' },
  { key: 'architecture', label: 'Architecture' }
];