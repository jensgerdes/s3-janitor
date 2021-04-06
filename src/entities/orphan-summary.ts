export default interface OrphanSummary {
  orphans: string[];
  stats: {
    totalBuckets: number;
    referencedBuckets: number;
    orphanedBuckets: number;
  };
}
