/**
 * Cloud Sync UI - واجهة مستخدم المزامنة السحابية
 * يوفر واجهة شاملة لإدارة المزامنة السحابية
 */

class CloudSyncUI {
    constructor() {
        this.modal = null;
        this.isInitialized = false;
        this.init();
    }
    
    /**
     * تهيئة الواجهة
     */
    init() {
        if (this.isInitialized) return;
        
        this.createModal();
        this.bindEvents();
        this.updateUI();
        this.isInitialized = true;
        
        console.log('✅ Cloud Sync UI initialized');
    }
    
    /**
     * إنشاء نافذة المزامنة السحابية
     */
    createModal() {
        const modalHTML = `
            <div class="modal" id="cloudSyncModal">
                <div class="modal-content cloud-sync-modal">
                    <div class="modal-header">
                        <div class="header-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                        <div class="header-content">
                            <h3>المزامنة السحابية المتقدمة</h3>
                            <p>مزامنة شاملة لجميع بيانات الموقع مع GitHub/GitLab</p>
                        </div>
                        <button class="close-btn" onclick="cloudSyncUI.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <!-- حالة المزامنة -->
                        <div class="sync-status-section">
                            <div class="status-header">
                                <h4><i class="fas fa-info-circle"></i> حالة المزامنة</h4>
                            </div>
                            <div class="status-grid">
                                <div class="status-item">
                                    <div class="status-label">الحالة:</div>
                                    <div class="status-value" id="syncStatusText">غير محدد</div>
                                </div>
                                <div class="status-item">
                                    <div class="status-label">آخر مزامنة:</div>
                                    <div class="status-value" id="lastSyncTime">لم يتم</div>
                                </div>
                                <div class="status-item">
                                    <div class="status-label">الاتصال:</div>
                                    <div class="status-value" id="onlineIndicator">غير متصل</div>
                                </div>
                                <div class="status-item">
                                    <div class="status-label">الأخطاء:</div>
                                    <div class="status-value" id="errorCount">0</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- إعدادات المزامنة -->
                        <div class="sync-config-section">
                            <div class="config-header">
                                <h4><i class="fas fa-cog"></i> إعدادات المزامنة</h4>
                            </div>
                            
                            <div class="config-form">
                                <div class="form-group">
                                    <label class="switch-label">
                                        <input type="checkbox" id="enableCloudSync" class="switch-input">
                                        <span class="switch-slider"></span>
                                        <span class="switch-text">تفعيل المزامنة السحابية</span>
                                    </label>
                                </div>
                                
                                <div class="config-details" id="configDetails" style="display: none;">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="syncProvider">مزود الخدمة</label>
                                            <select id="syncProvider" class="form-select">
                                                <option value="github">GitHub</option>
                                                <option value="gitlab">GitLab</option>
                                            </select>
                                        </div>
                                        
                                        <div class="form-group">
                                            <label for="syncRepository">المستودع</label>
                                            <input type="text" id="syncRepository" class="form-input" 
                                                   placeholder="username/repository-name">
                                        </div>
                                    </div>
                                    
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="syncToken">رمز الوصول</label>
                                            <div class="password-input">
                                                <input type="password" id="syncToken" class="form-input" 
                                                       placeholder="أدخل رمز الوصول">
                                                <button type="button" class="toggle-password" onclick="cloudSyncUI.togglePassword()">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div class="form-group">
                                            <label for="syncBranch">الفرع</label>
                                            <input type="text" id="syncBranch" class="form-input" 
                                                   value="main" placeholder="main">
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="switch-label">
                                            <input type="checkbox" id="autoSync" class="switch-input" checked>
                                            <span class="switch-slider"></span>
                                            <span class="switch-text">مزامنة تلقائية</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- إحصائيات البيانات -->
                        <div class="data-stats-section">
                            <div class="stats-header">
                                <h4><i class="fas fa-chart-bar"></i> إحصائيات البيانات</h4>
                            </div>
                            <div class="stats-grid" id="dataStats">
                                <!-- سيتم ملؤها ديناميكياً -->
                            </div>
                        </div>
                        
                        <!-- أزرار التحكم -->
                        <div class="sync-actions-section">
                            <div class="actions-header">
                                <h4><i class="fas fa-tools"></i> أدوات المزامنة</h4>
                            </div>
                            <div class="actions-grid">
                                <button class="action-btn test-btn" onclick="cloudSyncUI.testConnection()">
                                    <i class="fas fa-link"></i>
                                    <span>اختبار الاتصال</span>
                                </button>
                                
                                <button class="action-btn sync-btn" onclick="cloudSyncUI.syncNow()">
                                    <i class="fas fa-sync-alt"></i>
                                    <span>مزامنة الآن</span>
                                </button>
                                
                                <button class="action-btn download-btn" onclick="cloudSyncUI.downloadData()">
                                    <i class="fas fa-download"></i>
                                    <span>تحميل من السحابة</span>
                                </button>
                                
                                <button class="action-btn upload-btn" onclick="cloudSyncUI.uploadData()">
                                    <i class="fas fa-upload"></i>
                                    <span>رفع إلى السحابة</span>
                                </button>
                                
                                <button class="action-btn export-btn" onclick="cloudSyncUI.exportData()">
                                    <i class="fas fa-file-export"></i>
                                    <span>تصدير البيانات</span>
                                </button>
                                
                                <button class="action-btn import-btn" onclick="cloudSyncUI.importData()">
                                    <i class="fas fa-file-import"></i>
                                    <span>استيراد البيانات</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- سجل المزامنة -->
                        <div class="sync-log-section">
                            <div class="log-header">
                                <h4><i class="fas fa-history"></i> سجل المزامنة</h4>
                                <button class="clear-log-btn" onclick="cloudSyncUI.clearLog()">
                                    <i class="fas fa-trash"></i>
                                    مسح السجل
                                </button>
                            </div>
                            <div class="log-content" id="syncLog">
                                <!-- سيتم ملؤها ديناميكياً -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="cloudSyncUI.closeModal()">
                            <i class="fas fa-times"></i>
                            إغلاق
                        </button>
                        <button class="btn btn-primary" onclick="cloudSyncUI.saveSettings()">
                            <i class="fas fa-save"></i>
                            حفظ الإعدادات
                        </button>
                    </div>
                </div>
                <div class="modal-overlay" onclick="cloudSyncUI.closeModal()"></div>
            </div>
        `;
        
        // إضافة النافذة إلى DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('cloudSyncModal');
        
        // إضافة ملف CSS للمزامنة السحابية
        this.addStyles();
    }
    
    /**
     * إضافة أنماط CSS
     */
    addStyles() {
        if (document.getElementById('cloudSyncStyles')) return;
        
        const styles = `
            <style id="cloudSyncStyles">
                .cloud-sync-modal {
                    max-width: 900px;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                
                .modal-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 20px;
                    border-bottom: 1px solid var(--border-color);
                }
                
                .header-icon {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 20px;
                }
                
                .header-content h3 {
                    margin: 0 0 5px 0;
                    color: var(--text-primary);
                }
                
                .header-content p {
                    margin: 0;
                    color: var(--text-secondary);
                    font-size: 14px;
                }
                
                .modal-body {
                    padding: 20px;
                }
                
                .sync-status-section,
                .sync-config-section,
                .data-stats-section,
                .sync-actions-section,
                .sync-log-section {
                    margin-bottom: 30px;
                    padding: 20px;
                    background: var(--card-bg);
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                }
                
                .status-header,
                .config-header,
                .stats-header,
                .actions-header,
                .log-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 15px;
                }
                
                .status-header h4,
                .config-header h4,
                .stats-header h4,
                .actions-header h4,
                .log-header h4 {
                    margin: 0;
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .status-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }
                
                .status-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px;
                    background: var(--bg-secondary);
                    border-radius: 8px;
                }
                
                .status-label {
                    font-weight: 500;
                    color: var(--text-secondary);
                }
                
                .status-value {
                    font-weight: 600;
                    color: var(--text-primary);
                }
                
                .status-value.success { color: #10b981; }
                .status-value.error { color: #ef4444; }
                .status-value.syncing { color: #f59e0b; }
                .status-value.pending { color: #6b7280; }
                
                .online { color: #10b981; }
                .offline { color: #ef4444; }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 15px;
                }
                
                .form-group {
                    margin-bottom: 15px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                    color: var(--text-primary);
                }
                
                .form-input,
                .form-select {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    font-size: 14px;
                }
                
                .form-input:focus,
                .form-select:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                
                .password-input {
                    position: relative;
                }
                
                .password-input input {
                    padding-right: 40px;
                }
                
                .toggle-password {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                }
                
                .switch-label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                }
                
                .switch-input {
                    display: none;
                }
                
                .switch-slider {
                    width: 50px;
                    height: 24px;
                    background: var(--border-color);
                    border-radius: 12px;
                    position: relative;
                    transition: background 0.3s;
                }
                
                .switch-slider::before {
                    content: '';
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    top: 2px;
                    left: 2px;
                    transition: transform 0.3s;
                }
                
                .switch-input:checked + .switch-slider {
                    background: var(--primary-color);
                }
                
                .switch-input:checked + .switch-slider::before {
                    transform: translateX(26px);
                }
                
                .switch-text {
                    font-weight: 500;
                    color: var(--text-primary);
                }
                
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                }
                
                .stat-item {
                    text-align: center;
                    padding: 15px;
                    background: var(--bg-secondary);
                    border-radius: 8px;
                }
                
                .stat-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--primary-color);
                    margin-bottom: 5px;
                }
                
                .stat-label {
                    font-size: 12px;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .actions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }
                
                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 15px 20px;
                    border: none;
                    border-radius: 8px;
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .action-btn:hover {
                    background: var(--primary-color);
                    color: white;
                    transform: translateY(-2px);
                }
                
                .action-btn i {
                    font-size: 16px;
                }
                
                .test-btn:hover { background: #10b981; }
                .sync-btn:hover { background: #3b82f6; }
                .download-btn:hover { background: #8b5cf6; }
                .upload-btn:hover { background: #f59e0b; }
                .export-btn:hover { background: #06b6d4; }
                .import-btn:hover { background: #84cc16; }
                
                .log-content {
                    max-height: 200px;
                    overflow-y: auto;
                    background: var(--bg-primary);
                    border-radius: 8px;
                    padding: 15px;
                }
                
                .log-entry {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 0;
                    border-bottom: 1px solid var(--border-color);
                }
                
                .log-entry:last-child {
                    border-bottom: none;
                }
                
                .log-time {
                    font-size: 12px;
                    color: var(--text-secondary);
                    min-width: 80px;
                }
                
                .log-type {
                    width: 20px;
                    text-align: center;
                }
                
                .log-type.success { color: #10b981; }
                .log-type.error { color: #ef4444; }
                .log-type.info { color: #3b82f6; }
                .log-type.warning { color: #f59e0b; }
                
                .log-message {
                    flex: 1;
                    font-size: 14px;
                    color: var(--text-primary);
                }
                
                .clear-log-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .clear-log-btn:hover {
                    color: var(--text-primary);
                }
                
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    padding: 20px;
                    border-top: 1px solid var(--border-color);
                }
                
                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s;
                }
                
                .btn-primary {
                    background: var(--primary-color);
                    color: white;
                }
                
                .btn-primary:hover {
                    background: var(--primary-hover);
                }
                
                .btn-secondary {
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                }
                
                .btn-secondary:hover {
                    background: var(--bg-primary);
                }
                
                @media (max-width: 768px) {
                    .cloud-sync-modal {
                        max-width: 95vw;
                        margin: 20px auto;
                    }
                    
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .actions-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .status-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    /**
     * ربط الأحداث
     */
    bindEvents() {
        // تبديل تفعيل المزامنة السحابية
        const enableSwitch = document.getElementById('enableCloudSync');
        if (enableSwitch) {
            enableSwitch.addEventListener('change', () => {
                this.toggleConfigDetails();
            });
        }
        
        // تحديث تلقائي للواجهة
        setInterval(() => {
            this.updateUI();
        }, 1000);
    }
    
    /**
     * تبديل عرض تفاصيل الإعدادات
     */
    toggleConfigDetails() {
        const enableSwitch = document.getElementById('enableCloudSync');
        const configDetails = document.getElementById('configDetails');
        
        if (enableSwitch && configDetails) {
            if (enableSwitch.checked) {
                configDetails.style.display = 'block';
            } else {
                configDetails.style.display = 'none';
            }
        }
    }
    
    /**
     * تحديث الواجهة
     */
    updateUI() {
        if (!window.cloudSyncManager) return;
        
        const status = window.cloudSyncManager.getStatus();
        
        // تحديث حالة المزامنة
        this.updateSyncStatus(status);
        
        // تحديث إحصائيات البيانات
        this.updateDataStats();
        
        // تحديث سجل المزامنة
        this.updateSyncLog();
    }
    
    /**
     * تحديث حالة المزامنة
     */
    updateSyncStatus(status) {
        const statusText = document.getElementById('syncStatusText');
        const lastSyncTime = document.getElementById('lastSyncTime');
        const onlineIndicator = document.getElementById('onlineIndicator');
        const errorCount = document.getElementById('errorCount');
        
        if (statusText) {
            if (status.isSyncing) {
                statusText.textContent = 'جاري المزامنة...';
                statusText.className = 'status-value syncing';
            } else if (status.errorCount > 0) {
                statusText.textContent = `خطأ (${status.errorCount})`;
                statusText.className = 'status-value error';
            } else {
                statusText.textContent = status.lastSync ? 'مكتملة' : 'لم يتم';
                statusText.className = `status-value ${status.lastSync ? 'success' : 'pending'}`;
            }
        }
        
        if (lastSyncTime) {
            lastSyncTime.textContent = status.lastSync ? 
                new Date(status.lastSync).toLocaleString('ar') : 'لم يتم';
        }
        
        if (onlineIndicator) {
            onlineIndicator.textContent = status.isOnline ? 'متصل' : 'غير متصل';
            onlineIndicator.className = status.isOnline ? 'online' : 'offline';
        }
        
        if (errorCount) {
            errorCount.textContent = status.errorCount;
        }
    }
    
    /**
     * تحديث إحصائيات البيانات
     */
    updateDataStats() {
        const statsGrid = document.getElementById('dataStats');
        if (!statsGrid) return;
        
        const channels = JSON.parse(localStorage.getItem('arabicTVChannels') || '[]');
        const favorites = JSON.parse(localStorage.getItem('arabicTVFavorites') || '[]');
        const settings = JSON.parse(localStorage.getItem('arabicTVSettings') || '{}');
        const categories = JSON.parse(localStorage.getItem('arabicTVCategories') || '[]');
        
        statsGrid.innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${channels.length}</div>
                <div class="stat-label">القنوات</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${favorites.length}</div>
                <div class="stat-label">المفضلة</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${Object.keys(settings).length}</div>
                <div class="stat-label">الإعدادات</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${categories.length}</div>
                <div class="stat-label">الفئات</div>
            </div>
        `;
    }
    
    /**
     * تحديث سجل المزامنة
     */
    updateSyncLog() {
        const logContent = document.getElementById('syncLog');
        if (!logContent) return;
        
        // الحصول على السجل من localStorage أو إنشاء سجل افتراضي
        let log = JSON.parse(localStorage.getItem('anonTVSyncLog') || '[]');
        
        // عرض آخر 10 إدخالات
        const recentLog = log.slice(-10).reverse();
        
        logContent.innerHTML = recentLog.map(entry => `
            <div class="log-entry">
                <div class="log-time">${new Date(entry.time).toLocaleTimeString('ar')}</div>
                <div class="log-type ${entry.type}">
                    <i class="fas fa-${this.getLogIcon(entry.type)}"></i>
                </div>
                <div class="log-message">${entry.message}</div>
            </div>
        `).join('');
    }
    
    /**
     * الحصول على أيقونة نوع السجل
     */
    getLogIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'circle';
    }
    
    /**
     * إضافة إدخال إلى سجل المزامنة
     */
    addLogEntry(type, message) {
        const log = JSON.parse(localStorage.getItem('anonTVSyncLog') || '[]');
        log.push({
            time: new Date().toISOString(),
            type,
            message
        });
        
        // الاحتفاظ بآخر 50 إدخال فقط
        if (log.length > 50) {
            log.splice(0, log.length - 50);
        }
        
        localStorage.setItem('anonTVSyncLog', JSON.stringify(log));
    }
    
    /**
     * اختبار الاتصال
     */
    async testConnection() {
        this.addLogEntry('info', 'بدء اختبار الاتصال...');
        
        try {
            const result = await window.cloudSyncManager.testConnection();
            if (result) {
                this.addLogEntry('success', 'تم الاتصال بالمستودع بنجاح');
            } else {
                this.addLogEntry('error', 'فشل في الاتصال بالمستودع');
            }
        } catch (error) {
            this.addLogEntry('error', `خطأ في اختبار الاتصال: ${error.message}`);
        }
    }
    
    /**
     * مزامنة الآن
     */
    async syncNow() {
        this.addLogEntry('info', 'بدء المزامنة اليدوية...');
        
        try {
            const result = await window.cloudSyncManager.syncAll();
            if (result.success) {
                this.addLogEntry('success', result.message);
            } else {
                this.addLogEntry('error', result.message);
            }
        } catch (error) {
            this.addLogEntry('error', `خطأ في المزامنة: ${error.message}`);
        }
    }
    
    /**
     * تحميل البيانات من السحابة
     */
    async downloadData() {
        this.addLogEntry('info', 'بدء تحميل البيانات من السحابة...');
        
        try {
            const result = await window.cloudSyncManager.downloadFromCloud();
            if (result.success) {
                await window.cloudSyncManager.mergeData(result.data);
                this.addLogEntry('success', 'تم تحميل البيانات من السحابة بنجاح');
            } else {
                this.addLogEntry('error', result.message);
            }
        } catch (error) {
            this.addLogEntry('error', `خطأ في تحميل البيانات: ${error.message}`);
        }
    }
    
    /**
     * رفع البيانات إلى السحابة
     */
    async uploadData() {
        this.addLogEntry('info', 'بدء رفع البيانات إلى السحابة...');
        
        try {
            const result = await window.cloudSyncManager.uploadToCloud();
            if (result.success) {
                this.addLogEntry('success', 'تم رفع البيانات إلى السحابة بنجاح');
            } else {
                this.addLogEntry('error', result.message);
            }
        } catch (error) {
            this.addLogEntry('error', `خطأ في رفع البيانات: ${error.message}`);
        }
    }
    
    /**
     * تصدير البيانات
     */
    exportData() {
        try {
            const data = window.cloudSyncManager.collectAllData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `anon-tv-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.addLogEntry('success', 'تم تصدير البيانات بنجاح');
        } catch (error) {
            this.addLogEntry('error', `خطأ في تصدير البيانات: ${error.message}`);
        }
    }
    
    /**
     * استيراد البيانات
     */
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                
                await window.cloudSyncManager.mergeData(data);
                this.addLogEntry('success', 'تم استيراد البيانات بنجاح');
                
            } catch (error) {
                this.addLogEntry('error', `خطأ في استيراد البيانات: ${error.message}`);
            }
        };
        
        input.click();
    }
    
    /**
     * تبديل عرض كلمة المرور
     */
    togglePassword() {
        const tokenInput = document.getElementById('syncToken');
        const toggleBtn = document.querySelector('.toggle-password i');
        
        if (tokenInput && toggleBtn) {
            if (tokenInput.type === 'password') {
                tokenInput.type = 'text';
                toggleBtn.className = 'fas fa-eye-slash';
            } else {
                tokenInput.type = 'password';
                toggleBtn.className = 'fas fa-eye';
            }
        }
    }
    
    /**
     * حفظ الإعدادات
     */
    saveSettings() {
        try {
            const enableCloudSync = document.getElementById('enableCloudSync').checked;
            const provider = document.getElementById('syncProvider').value;
            const repository = document.getElementById('syncRepository').value.trim();
            const token = document.getElementById('syncToken').value.trim();
            const branch = document.getElementById('syncBranch').value.trim() || 'main';
            const autoSync = document.getElementById('autoSync').checked;
            
            if (enableCloudSync) {
                if (!repository) {
                    this.addLogEntry('error', 'يرجى إدخال رابط المستودع');
                    return;
                }
                
                if (!token) {
                    this.addLogEntry('error', 'يرجى إدخال رمز الوصول');
                    return;
                }
            }
            
            const newConfig = {
                enabled: enableCloudSync,
                provider,
                repository,
                token,
                branch,
                autoSync
            };
            
            window.cloudSyncManager.updateConfig(newConfig);
            this.addLogEntry('success', 'تم حفظ الإعدادات بنجاح');
            
        } catch (error) {
            this.addLogEntry('error', `خطأ في حفظ الإعدادات: ${error.message}`);
        }
    }
    
    /**
     * مسح السجل
     */
    clearLog() {
        localStorage.removeItem('anonTVSyncLog');
        this.addLogEntry('info', 'تم مسح سجل المزامنة');
    }
    
    /**
     * فتح النافذة
     */
    openModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.updateUI();
        }
    }
    
    /**
     * إغلاق النافذة
     */
    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// إنشاء مثيل عام للواجهة
window.cloudSyncUI = new CloudSyncUI();
