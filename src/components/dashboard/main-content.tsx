'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function MainContent() {
  const [typingTab, setTypingTab] = useState('last');
  const [stenoTab, setStenoTab] = useState('shorthand');

  const typingContent = {
    last: (
      <>
        <strong className="text-foreground">Last Practice:</strong> 42 WPM • 94%
        accuracy • 10 minutes
        <br />
        Tip: Accuracy first, speed will follow.
      </>
    ),
    daily: (
      <>
        <strong className="text-foreground">Daily Practice:</strong> 15 min
        warm-up → 10 min paragraph → 5 min accuracy check.
        <br />
        Goal: +1 WPM daily.
      </>
    ),
    accuracy: (
      <>
        <strong className="text-foreground">Accuracy Tests:</strong> Focus on
        error-free typing. Target 96%+.
        <br />
        Use slow typing drills for weak keys.
      </>
    ),
  };

  const stenoContent = {
    shorthand:
      'Practice shorthand basics with 10–15 minute audio lessons daily.',
    pdf: 'Download PDF notes and revise outlines. Practice writing 20 outlines/day.',
    dict: 'Start dictation at slow speed first. Increase speed gradually every week.',
  };

  return (
    <section className="grid min-h-[420px] grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Left Panel */}
      <div className="rounded-lg border bg-card/80 p-4 shadow-sm backdrop-blur-sm lg:col-span-1">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-foreground">
          Typing Practice
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTypingTab('last')}
            className={`rounded-full border px-3 py-1 text-xs ${
              typingTab === 'last'
                ? 'border-primary/50 bg-primary/10 font-semibold text-primary-foreground'
                : 'border-border bg-muted/50 hover:bg-muted'
            }`}
          >
            Last Practice Speed
          </button>
          <button
            onClick={() => setTypingTab('daily')}
            className={`rounded-full border px-3 py-1 text-xs ${
              typingTab === 'daily'
                ? 'border-primary/50 bg-primary/10 font-semibold text-primary-foreground'
                : 'border-border bg-muted/50 hover:bg-muted'
            }`}
          >
            Daily Practice
          </button>
          <button
            onClick={() => setTypingTab('accuracy')}
            className={`rounded-full border px-3 py-1 text-xs ${
              typingTab === 'accuracy'
                ? 'border-primary/50 bg-primary/10 font-semibold text-primary-foreground'
                : 'border-border bg-muted/50 hover:bg-muted'
            }`}
          >
            Accuracy Tests
          </button>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          {typingContent[typingTab as keyof typeof typingContent]}
        </div>

        <hr className="my-4" />

        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-foreground">
          Stenography / Shorthand Practice
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStenoTab('shorthand')}
            className={`rounded-full border px-3 py-1 text-xs ${
              stenoTab === 'shorthand'
                ? 'border-primary/50 bg-primary/10 font-semibold text-primary-foreground'
                : 'border-border bg-muted/50 hover:bg-muted'
            }`}
          >
            Shorthand Lessons (Audio)
          </button>
          <button
            onClick={() => setStenoTab('pdf')}
            className={`rounded-full border px-3 py-1 text-xs ${
              stenoTab === 'pdf'
                ? 'border-primary/50 bg-primary/10 font-semibold text-primary-foreground'
                : 'border-border bg-muted/50 hover:bg-muted'
            }`}
          >
            PDF Lessons
          </button>
          <button
            onClick={() => setStenoTab('dict')}
            className={`rounded-full border px-3 py-1 text-xs ${
              stenoTab === 'dict'
                ? 'border-primary/50 bg-primary/10 font-semibold text-primary-foreground'
                : 'border-border bg-muted/50 hover:bg-muted'
            }`}
          >
            Dictation
          </button>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          {stenoContent[stenoTab as keyof typeof stenoContent]}
        </div>
      </div>

      {/* Middle Panel */}
      <div className="rounded-lg border bg-card/80 p-4 shadow-sm backdrop-blur-sm lg:col-span-1">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-foreground">
          Tests & Regular Practice
        </h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Attempt typing and dictation practice tests and track your results.
        </p>
        <Button className="w-full bg-green-500 text-white hover:bg-green-600">
          Start Dictation Practice
        </Button>

        <h3 className="mb-2 mt-4 text-sm font-bold uppercase tracking-wider text-foreground">
          Middle News
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border bg-background/70 p-2.5">
            <div>
              <p className="text-xs font-semibold">Test Date</p>
              <p className="text-xs text-muted-foreground">
                Typing speed test scheduled
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              View
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-background/70 p-2.5">
            <div>
              <p className="text-xs font-semibold">Test Date</p>
              <p className="text-xs text-muted-foreground">
                Accuracy test update
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              View
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-background/70 p-2.5">
            <div>
              <p className="text-xs font-semibold">Speed & Accuracy</p>
              <p className="text-xs text-muted-foreground">
                New weekly target added
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Open
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-background/70 p-2.5">
            <div>
              <p className="text-xs font-semibold">Logout</p>
              <p className="text-xs text-muted-foreground">End session</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Logout
            </Button>
          </div>
        </div>
      </div>
      {/* Right Panel */}
      <div className="rounded-lg border bg-card/80 p-4 shadow-sm backdrop-blur-sm lg:col-span-1">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-foreground">
          Study Material
        </h3>
        <p className="mb-3 text-sm text-muted-foreground">
          PDFs, notes and lessons uploaded by admin.
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border bg-background/70 p-2.5">
            <div>
              <p className="text-xs font-semibold">Typing Basics (PDF)</p>
              <p className="text-xs text-muted-foreground">
                Uploaded: 2024-05-20
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Download
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-background/70 p-2.5">
            <div>
              <p className="text-xs font-semibold">Steno Dictation 01</p>
              <p className="text-xs text-muted-foreground">
                Uploaded: 2024-05-19
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Play
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-background/70 p-2.5">
            <div>
              <p className="text-xs font-semibold">Speed Test Sheet</p>
              <p className="text-xs text-muted-foreground">
                Uploaded: 2024-05-18
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Open
            </Button>
          </div>
        </div>

        <hr className="my-4" />

        <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-foreground">
          Profile & Settings
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border bg-background/70 p-2 text-xs">
            <span className="font-semibold">Email</span>
            <span className="text-muted-foreground">student@email.com</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-background/70 p-2 text-xs">
            <span className="font-semibold">Change Password</span>
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-background/70 p-2 text-xs">
            <span className="font-semibold">Status</span>
            <span className="text-muted-foreground">Active</span>
          </div>
        </div>

        <Button className="mt-4 w-full">Open Profile</Button>
      </div>
    </section>
  );
}
