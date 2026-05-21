import { ArrowLeft } from 'lucide-react';

export default function Loading() {
  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto mesh-bg min-h-screen pb-4">
      <div className="max-w-2xl mx-auto py-6">
        <div className="flex items-center gap-2 text-white/20 text-sm mb-4 pointer-events-none">
          <ArrowLeft size={16} /> Back to Feed
        </div>

        {/* Post skeleton card */}
        <div className="glass-card p-6 space-y-4">
          {/* Post Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full skeleton" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-36 skeleton rounded-md" />
              <div className="h-3 w-24 skeleton rounded-md" />
            </div>
          </div>

          {/* Post Content */}
          <div className="space-y-2.5 pt-2">
            <div className="h-4 w-full skeleton rounded-md" />
            <div className="h-4 w-11/12 skeleton rounded-md" />
            <div className="h-4 w-4/5 skeleton rounded-md" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            <div className="h-7 w-20 skeleton rounded-lg" />
            <div className="h-7 w-24 skeleton rounded-lg" />
            <div className="h-7 w-20 skeleton rounded-lg" />
          </div>
        </div>

        {/* Comments Section skeleton card */}
        <div className="glass-card p-6 mt-4 space-y-4">
          <div className="h-4 w-28 skeleton rounded-md" />

          {/* Comments skeleton */}
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full skeleton flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-28 skeleton rounded-md" />
                  <div className="h-3 w-full skeleton rounded-md" />
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input skeleton */}
          <div className="flex gap-2 items-center pt-3 border-t border-white/5">
            <div className="flex-1 h-10 skeleton rounded-lg" />
            <div className="w-10 h-10 skeleton rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
