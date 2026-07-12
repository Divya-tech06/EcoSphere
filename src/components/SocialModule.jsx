import React, { useState } from 'react';
import { Calendar, Users, Award, CheckCircle, Clock, Upload, Plus, FileText, AlertCircle } from 'lucide-react';

export default function SocialModule({
  csrActivities,
  challenges,
  departments,
  addCsrActivity,
  approveCsrActivity,
  joinCsrActivity,
  currentUser,
  currentRole,
  uploadCsrEvidence,
  settings,
  triggerNotification
}) {
  const [showAddCsr, setShowAddCsr] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newMaxPart, setNewMaxPart] = useState(25);
  const [newPoints, setNewPoints] = useState(150);
  const [newDept, setNewDept] = useState(departments[0]?.id || '');
  
  // File upload state per CSR activity (mock)
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadError, setUploadError] = useState('');

  const handleCreateCsr = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newDate) return;

    const newCsr = {
      id: `csr-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      date: newDate,
      maxParticipants: parseInt(newMaxPart),
      pointsValue: parseInt(newPoints),
      xpValue: parseInt(newPoints),
      participants: [currentUser], // Initiator is a participant
      status: 'Pending',
      evidenceFileAttached: false,
      evidenceFileName: '',
      departmentId: newDept
    };

    addCsrActivity(newCsr);
    triggerNotification('csr', 'CSR Activity Created', `Activity '${newTitle}' was created and is pending approval.`);
    
    // Reset form
    setNewTitle('');
    setNewDesc('');
    setNewDate('');
    setShowAddCsr(false);
  };

  // Real file upload handler
  const handleFileUpload = (e, activityId) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size or type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid file type! Only JPG, PNG, and PDF are allowed.');
      return;
    }
    setUploadError('');

    // Save evidence details to server
    uploadCsrEvidence(activityId, file.name);
    setUploadingId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Module Title Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-outfit">Social Engagement (CSR & Challenges)</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Join company-wide social activities, log eco-challenges, and track participations.</p>
        </div>
        <button 
          onClick={() => setShowAddCsr(!showAddCsr)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Propose CSR Activity
        </button>
      </div>

      {/* Settings Info Banner */}
      <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-2xl border border-white/60 dark:border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <span className="font-bold">Social Settings Active:</span>
            <span className="block text-slate-400">
              Evidence Requirement is <strong className={settings.evidenceRequirement ? 'text-emerald-500' : 'text-slate-500'}>{settings.evidenceRequirement ? 'ENABLED' : 'DISABLED'}</strong>.
              {settings.evidenceRequirement && ' CSR activities must have evidence files attached before admin approval is allowed.'}
            </span>
          </div>
        </div>
      </div>

      {/* Propose CSR Activity Form */}
      {showAddCsr && (
        <form onSubmit={handleCreateCsr} className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold font-outfit text-emerald-600 dark:text-emerald-400">Propose CSR Activity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-400">Activity Title</label>
              <input 
                type="text" 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)} 
                placeholder="e.g. Tree Plantation Drive"
                className="w-full text-xs font-semibold p-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500" 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-400">Date</label>
              <input 
                type="date" 
                value={newDate} 
                onChange={(e) => setNewDate(e.target.value)} 
                className="w-full text-xs font-semibold p-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500" 
                required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-400">Description</label>
            <textarea 
              value={newDesc} 
              onChange={(e) => setNewDesc(e.target.value)} 
              rows="3"
              placeholder="Detail the scope of the CSR activity and how it supports sustainability goals..."
              className="w-full text-xs font-semibold p-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500" 
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-400">Max Participants</label>
              <input 
                type="number" 
                value={newMaxPart} 
                onChange={(e) => setNewMaxPart(e.target.value)} 
                className="w-full text-xs font-bold p-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500" 
                min="5" 
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-400">Points & XP Value</label>
              <input 
                type="number" 
                value={newPoints} 
                onChange={(e) => setNewPoints(e.target.value)} 
                className="w-full text-xs font-bold p-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500" 
                min="10" 
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-400">Organizing Department</label>
              <select 
                value={newDept} 
                onChange={(e) => setNewDept(e.target.value)} 
                className="w-full text-xs font-semibold p-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => setShowAddCsr(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
            >
              Submit Proposal
            </button>
          </div>
        </form>
      )}

      {/* Grid of CSR Activities */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-outfit">Active CSR Initiatives</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {csrActivities.map((act) => {
            const isParticipant = act.participants.includes(currentUser);
            const dept = departments.find(d => d.id === act.departmentId);
            
            // Check if approval is disabled due to evidence missing
            const approvalBlocked = settings.evidenceRequirement && !act.evidenceFileAttached;

            return (
              <div key={act.id} className="glass-card glass-panel rounded-2xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden">
                {/* Header status */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {dept?.code || 'CSR'}
                    </span>
                    <h3 className="text-base font-bold font-outfit mt-1.5">{act.title}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    act.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                  }`}>
                    {act.status === 'Approved' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {act.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {act.description}
                </p>

                {/* Info row */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-semibold">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{act.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{act.participants.length} / {act.maxParticipants} Joined</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{act.pointsValue} Points/XP</span>
                  </div>
                </div>

                {/* Evidence section */}
                <div className="bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px]">
                  <div>
                    <span className="font-bold text-slate-400 block uppercase tracking-wider text-[8px]">Verification Evidence</span>
                    {act.evidenceFileAttached ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                        <FileText className="w-3 h-3" /> {act.evidenceFileName}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-500 dark:text-rose-400 font-bold mt-0.5">
                        <AlertCircle className="w-3 h-3" /> No proof uploaded yet
                      </span>
                    )}
                  </div>
                  
                  {act.status === 'Pending' && (
                    <div>
                      {uploadingId === act.id ? (
                        <input 
                          type="file" 
                          onChange={(e) => handleFileUpload(e, act.id)} 
                          className="w-24 text-[8px]" 
                          accept=".png,.jpg,.jpeg,.pdf"
                        />
                      ) : (
                        <button 
                          onClick={() => setUploadingId(act.id)} 
                          className="px-2 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-[9px] rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" /> Upload Proof
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {uploadError && uploadingId === act.id && (
                  <p className="text-[10px] text-rose-500 font-bold">{uploadError}</p>
                )}

                {/* Bottom Actions */}
                <div className="flex justify-between items-center gap-2 pt-1">
                  {/* Participants Avatars representation */}
                  <div className="flex -space-x-2 overflow-hidden">
                    {act.participants.slice(0, 3).map((p, idx) => (
                      <div key={idx} className="w-6 h-6 rounded-full bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-white border-2 border-white dark:border-slate-900" title={p}>
                        {p.split(' ').map(n=>n[0]).join('')}
                      </div>
                    ))}
                    {act.participants.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-600 dark:text-slate-400 border-2 border-white dark:border-slate-900">
                        +{act.participants.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {/* Join button */}
                    {act.status === 'Pending' && !isParticipant && act.participants.length < act.maxParticipants && (
                      <button 
                        onClick={() => joinCsrActivity(act.id, currentUser)}
                        className="px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] rounded-xl transition-colors"
                      >
                        Join Team
                      </button>
                    )}

                    {/* Admin Approval Button */}
                    {act.status === 'Pending' && (currentRole === 'Admin' || currentRole === 'Manager') && (
                      <div className="flex items-center gap-1.5">
                        {approvalBlocked && (
                          <span className="text-[9px] text-rose-500 dark:text-rose-400 font-bold max-w-[120px] text-right leading-3">
                            Requires evidence proof file
                          </span>
                        )}
                        <button 
                          onClick={() => approveCsrActivity(act.id)}
                          disabled={approvalBlocked}
                          className={`px-3 py-1.5 font-bold text-[10px] rounded-xl transition-colors ${
                            approvalBlocked 
                              ? 'bg-slate-100 text-slate-400 dark:bg-slate-850 dark:text-slate-600 cursor-not-allowed' 
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }`}
                        >
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Challenges Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold font-outfit">Active Sustainability Challenges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((ch) => (
            <div key={ch.id} className="glass-panel rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    ch.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30' :
                    ch.difficulty === 'Medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/30' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-950/30'
                  }`}>
                    {ch.difficulty}
                  </span>
                  <h3 className="text-sm font-bold font-outfit mt-2">{ch.name}</h3>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  ch.status === 'Active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/30' :
                  ch.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30' :
                  'bg-slate-100 text-slate-800 dark:bg-slate-900'
                }`}>
                  {ch.status}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>Target: {ch.targetMetric}</span>
                  <span className="text-slate-600 dark:text-slate-300 font-bold">{ch.targetValue}</span>
                </div>
                {/* Mock progress bar */}
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${ch.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: ch.status === 'Completed' ? '100%' : '45%' }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] pt-1">
                <span className="text-slate-400 font-semibold">Ends: {ch.endDate}</span>
                <span className="font-bold text-emerald-500">+{ch.rewardPoints} XP / Points</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
