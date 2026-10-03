// src/lib/SupabaseClient.js

import { createClient } from '@supabase/supabase-js';
import localTokoJson from '../data/tokoKue.json';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lpygndiashzwdzqgusnm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==================== LOCAL STORAGE KEYS & MOCK DATA ====================

const TOKO_LOCAL_KEY = 'webgis_toko_data';
const USERS_LOCAL_KEY = 'webgis_users_data';
const REQUESTS_LOCAL_KEY = 'webgis_requests_data';
const LOGS_LOCAL_KEY = 'webgis_logs_data';

const DEFAULT_USERS = [
  {
    user_id: 1,
    nama_lengkap: 'Admin GIS Pekanbaru',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    user_id: 2,
    nama_lengkap: 'Owner Toko Kue',
    email: 'owner@gmail.com',
    password: 'owner123',
    role: 'owner'
  }
];

function normalizeToko(item) {
  return {
    ...item,
    id: Number(item.id),
    nama: item.nama || '',
    lat: item.lat !== undefined && item.lat !== null ? parseFloat(item.lat) : 0.5333,
    lng: item.lng !== undefined && item.lng !== null ? parseFloat(item.lng) : 101.4333,
    kecamatan: item.kecamatan || 'Tidak diketahui',
    kelurahan: item.kelurahan || 'Tidak diketahui',
    jalan: item.jalan || item.alamat || '-',
    alamat: item.alamat || item.jalan || '-',
    produk: item.produk || 'Kue',
    jam_buka: item.jam_buka || item.jamBuka || '08:00 - 21:00',
    jamBuka: item.jamBuka || item.jam_buka || '08:00 - 21:00',
    tahun_berdiri: item.tahun_berdiri || item.tahunBerdiri || 2020,
    tahunBerdiri: item.tahunBerdiri || item.tahun_berdiri || 2020,
    rating: item.rating !== undefined && item.rating !== null ? parseFloat(item.rating) : 4.5,
    telp: item.telp || item.no_telp || '-',
    menu_favorit: item.menu_favorit || item.menuFavorit || 'Kue Spesial',
    menuFavorit: item.menuFavorit || item.menu_favorit || 'Kue Spesial',
    deskripsi: item.deskripsi || `${item.nama} adalah salah satu pilihan toko kue terbaik di Pekanbaru.`,
    gambar: item.gambar || null,
    gambarmenu: item.gambarmenu || item.gambar_menu || null,
    user_id: item.user_id || 2
  };
}

function getLocalTokos() {
  try {
    const saved = localStorage.getItem(TOKO_LOCAL_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeToko);
      }
    }
  } catch (e) {
    console.warn('Error membaca localStorage toko:', e);
  }

  const rawList = localTokoJson?.tokoKue || [];
  const normalized = rawList.map(normalizeToko);
  try {
    localStorage.setItem(TOKO_LOCAL_KEY, JSON.stringify(normalized));
  } catch (e) {}
  return normalized;
}

function saveLocalTokos(tokos) {
  try {
    localStorage.setItem(TOKO_LOCAL_KEY, JSON.stringify(tokos));
  } catch (e) {}
}

function getLocalUsers() {
  try {
    const saved = localStorage.getItem(USERS_LOCAL_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  try {
    localStorage.setItem(USERS_LOCAL_KEY, JSON.stringify(DEFAULT_USERS));
  } catch (e) {}
  return DEFAULT_USERS;
}

function saveLocalUsers(users) {
  try {
    localStorage.setItem(USERS_LOCAL_KEY, JSON.stringify(users));
  } catch (e) {}
}

function getLocalRequests() {
  try {
    const saved = localStorage.getItem(REQUESTS_LOCAL_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return [];
}

function saveLocalRequests(requests) {
  try {
    localStorage.setItem(REQUESTS_LOCAL_KEY, JSON.stringify(requests));
  } catch (e) {}
}

function getLocalLogs() {
  try {
    const saved = localStorage.getItem(LOGS_LOCAL_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return [];
}

function saveLocalLogs(logs) {
  try {
    localStorage.setItem(LOGS_LOCAL_KEY, JSON.stringify(logs));
  } catch (e) {}
}

// ==================== AUTH FUNCTIONS ====================

/**
 * Login user dengan tabel users custom (fallback ke data lokal jika Supabase offline)
 */
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (!error && data) {
      return {
        success: true,
        user: {
          user_id: data.user_id,
          email: data.email,
          role: data.role,
          nama_lengkap: data.nama_lengkap
        }
      };
    }
  } catch (err) {
    console.warn('[Supabase Fallback] Supabase offline, menggunakan autentikasi lokal:', err.message);
  }

  // Fallback ke local users
  const users = getLocalUsers();
  const matched = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
  if (matched) {
    return {
      success: true,
      user: {
        user_id: matched.user_id,
        email: matched.email,
        role: matched.role,
        nama_lengkap: matched.nama_lengkap
      }
    };
  }

  return { success: false, error: 'Email atau password salah' };
};

/**
 * Register user baru (dengan fallback ke lokal jika offline)
 */
export const registerUser = async ({ nama_lengkap, email, password, role = 'owner' }) => {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email.trim())
      .single();

    if (existingUser) {
      return { success: false, error: 'Email sudah terdaftar! Silakan gunakan email lain atau login.' };
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{
        nama_lengkap,
        email: email.trim(),
        password,
        role
      }])
      .select();

    if (!error && data && data.length > 0) {
      return { success: true, data: data[0] };
    }
  } catch (err) {
    console.warn('[Supabase Fallback] Supabase offline, registrasi disimpan di penyimpanan lokal:', err.message);
  }

  // Fallback lokal
  const users = getLocalUsers();
  const exists = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (exists) {
    return { success: false, error: 'Email sudah terdaftar! Silakan gunakan email lain atau login.' };
  }

  const newUser = {
    user_id: Date.now(),
    nama_lengkap,
    email: email.trim(),
    password,
    role
  };
  users.push(newUser);
  saveLocalUsers(users);

  return { success: true, data: newUser };
};

export const logoutUser = async () => {
  return { success: true };
};

export const getUserById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!error && data) return { success: true, data };
  } catch (err) {}

  const users = getLocalUsers();
  const user = users.find(u => u.user_id === Number(userId));
  if (user) return { success: true, data: user };
  return { success: false, error: 'User tidak ditemukan' };
};

export const getUserByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!error && data) return { success: true, data };
  } catch (err) {}

  const users = getLocalUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) return { success: true, data: user };
  return { success: false, error: 'User tidak ditemukan' };
};

export const updateUserProfile = async (userId, namaLengkap) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ nama_lengkap: namaLengkap })
      .eq('user_id', userId)
      .select();

    if (!error && data) return { success: true, data: data[0] };
  } catch (err) {}

  const users = getLocalUsers();
  const index = users.findIndex(u => u.user_id === Number(userId));
  if (index !== -1) {
    users[index].nama_lengkap = namaLengkap;
    saveLocalUsers(users);
    return { success: true, data: users[index] };
  }
  return { success: false, error: 'User tidak ditemukan' };
};

export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  try {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!fetchError && user) {
      if (user.password !== currentPassword) {
        throw new Error('Password saat ini salah');
      }
      const { data, error } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('user_id', userId)
        .select();

      if (!error && data) return { success: true, data: data[0] };
    }
  } catch (err) {
    if (err.message === 'Password saat ini salah') {
      return { success: false, error: err.message };
    }
  }

  const users = getLocalUsers();
  const user = users.find(u => u.user_id === Number(userId));
  if (!user) return { success: false, error: 'User tidak ditemukan' };
  if (user.password !== currentPassword) {
    return { success: false, error: 'Password saat ini salah' };
  }
  user.password = newPassword;
  saveLocalUsers(users);
  return { success: true, data: user };
};

// ==================== TOKO KUE CRUD FUNCTIONS ====================

/**
 * GET: Ambil semua toko
 */
export const getAllToko = async () => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data && data.length > 0) {
      return { success: true, data: data.map(normalizeToko) };
    }
  } catch (error) {
    console.warn('[Supabase Fallback] Menggunakan data lokal tokoKue.json:', error.message);
  }

  // Fallback ke data lokal (tokoKue.json)
  const localData = getLocalTokos();
  return { success: true, data: localData };
};

/**
 * GET: Ambil toko milik owner tertentu
 */
export const getTokoByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .select('*')
      .eq('user_id', userId)
      .order('id', { ascending: true });

    if (!error && data) {
      return { success: true, data: data.map(normalizeToko) };
    }
  } catch (error) {}

  const tokos = getLocalTokos();
  // Filter toko berdasarkan user_id (atau kembalikan beberapa toko untuk demonstrasi owner)
  const filtered = tokos.filter(t => t.user_id === Number(userId));
  return { success: true, data: filtered.length > 0 ? filtered : tokos.slice(0, 3) };
};

/**
 * GET: Ambil 1 toko berdasarkan ID
 */
export const getTokoById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      return { success: true, data: normalizeToko(data) };
    }
  } catch (error) {}

  const tokos = getLocalTokos();
  const toko = tokos.find(t => String(t.id) === String(id));
  if (toko) {
    return { success: true, data: toko };
  }
  return { success: false, error: 'Toko tidak ditemukan' };
};

/**
 * POST: Tambah toko baru
 */
export const addToko = async (tokoData) => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .insert([tokoData])
      .select();

    if (!error && data && data.length > 0) {
      return { success: true, data: normalizeToko(data[0]) };
    }
  } catch (error) {}

  const tokos = getLocalTokos();
  const newToko = normalizeToko({
    ...tokoData,
    id: tokos.length > 0 ? Math.max(...tokos.map(t => t.id || 0)) + 1 : 1
  });
  tokos.push(newToko);
  saveLocalTokos(tokos);
  return { success: true, data: newToko };
};

/**
 * PUT: Update toko
 */
export const updateToko = async (id, tokoData) => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .update(tokoData)
      .eq('id', id)
      .select();

    if (!error && data && data.length > 0) {
      return { success: true, data: normalizeToko(data[0]) };
    }
  } catch (error) {}

  const tokos = getLocalTokos();
  const index = tokos.findIndex(t => String(t.id) === String(id));
  if (index !== -1) {
    tokos[index] = normalizeToko({ ...tokos[index], ...tokoData });
    saveLocalTokos(tokos);
    return { success: true, data: tokos[index] };
  }
  return { success: false, error: 'Toko tidak ditemukan' };
};

/**
 * DELETE: Hapus toko
 */
export const deleteToko = async (id) => {
  try {
    const { error } = await supabase
      .from('toko_kue')
      .delete()
      .eq('id', id);

    if (!error) return { success: true };
  } catch (error) {}

  const tokos = getLocalTokos();
  const filtered = tokos.filter(t => String(t.id) !== String(id));
  saveLocalTokos(filtered);
  return { success: true };
};

// ==================== TOKO REQUEST FUNCTIONS ====================

export const createTokoRequest = async (requestData) => {
  try {
    const requestPayload = {
      user_id: requestData.user_id,
      nama: requestData.nama,
      lat: requestData.lat,
      lng: requestData.lng,
      kecamatan: requestData.kecamatan || null,
      kelurahan: requestData.kelurahan || null,
      jalan: requestData.jalan || requestData.alamat || null,
      produk: requestData.produk,
      jam_buka: requestData.jam_buka || null,
      tahun_berdiri: requestData.tahun_berdiri || null,
      telp: requestData.telp || requestData.no_telp || null,
      menu_favorit: requestData.menu_favorit || null,
      deskripsi: requestData.deskripsi || null,
      gambar: requestData.gambar || requestData.gambar_toko || null,
      gambarmenu: requestData.gambarmenu || requestData.gambar_menu || null,
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('toko_requests')
      .insert([requestPayload])
      .select();

    if (!error && data && data.length > 0) {
      return { success: true, data: data[0] };
    }
  } catch (error) {}

  const requests = getLocalRequests();
  const newReq = {
    id: Date.now(),
    ...requestData,
    status: 'pending',
    created_at: new Date().toISOString()
  };
  requests.unshift(newReq);
  saveLocalRequests(requests);
  return { success: true, data: newReq };
};

export const getAllRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('toko_requests')
      .select(`
        *,
        users (
          email,
          nama_lengkap,
          role
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && data) return { success: true, data };
  } catch (error) {}

  return { success: true, data: getLocalRequests() };
};

export const getRequestsByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('toko_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) return { success: true, data };
  } catch (error) {}

  const requests = getLocalRequests();
  const filtered = requests.filter(r => Number(r.user_id) === Number(userId));
  return { success: true, data: filtered };
};

export const approveRequest = async (requestId, adminNote = '') => {
  try {
    const { data: request } = await supabase
      .from('toko_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (request) {
      const tokoPayload = {
        user_id: request.user_id,
        nama: request.nama,
        lat: request.lat ? parseFloat(request.lat) : null,
        lng: request.lng ? parseFloat(request.lng) : null,
        kecamatan: request.kecamatan || null,
        kelurahan: request.kelurahan || null,
        jalan: request.jalan || request.alamat || null,
        produk: request.produk || 'Kue',
        jam_buka: request.jam_buka || null,
        telp: request.telp || request.no_telp || null,
        menu_favorit: request.menu_favorit || null,
        deskripsi: request.deskripsi || null,
        gambar: request.gambar || request.gambar_toko || null,
        gambarmenu: request.gambarmenu || request.gambar_menu || null,
        rating: null,
        tahun_berdiri: request.tahun_berdiri ? parseInt(request.tahun_berdiri) : null
      };

      const { data: newToko } = await supabase
        .from('toko_kue')
        .insert([tokoPayload])
        .select();

      await supabase
        .from('toko_requests')
        .update({ status: 'approved', admin_note: adminNote || null })
        .eq('id', requestId);

      if (newToko && newToko.length > 0) {
        return { success: true, data: newToko[0] };
      }
    }
  } catch (error) {}

  // Fallback lokal
  const requests = getLocalRequests();
  const req = requests.find(r => String(r.id) === String(requestId));
  if (req) {
    req.status = 'approved';
    req.admin_note = adminNote;
    saveLocalRequests(requests);

    // Tambah ke toko lokal
    addToko({
      user_id: req.user_id,
      nama: req.nama,
      lat: req.lat,
      lng: req.lng,
      kecamatan: req.kecamatan,
      kelurahan: req.kelurahan,
      jalan: req.jalan,
      produk: req.produk,
      jam_buka: req.jam_buka,
      tahun_berdiri: req.tahun_berdiri,
      telp: req.telp,
      menu_favorit: req.menu_favorit,
      deskripsi: req.deskripsi,
      gambar: req.gambar,
      gambarmenu: req.gambarmenu
    });

    return { success: true, data: req };
  }
  return { success: false, error: 'Request tidak ditemukan' };
};

export const rejectRequest = async (requestId, adminNote = '') => {
  try {
    const { error } = await supabase
      .from('toko_requests')
      .update({
        status: 'rejected',
        admin_note: adminNote || null
      })
      .eq('id', requestId);

    if (!error) return { success: true };
  } catch (error) {}

  const requests = getLocalRequests();
  const req = requests.find(r => String(r.id) === String(requestId));
  if (req) {
    req.status = 'rejected';
    req.admin_note = adminNote;
    saveLocalRequests(requests);
    return { success: true };
  }
  return { success: false, error: 'Request tidak ditemukan' };
};

export const deleteRequest = async (requestId) => {
  try {
    const { error } = await supabase
      .from('toko_requests')
      .delete()
      .eq('id', requestId);

    if (!error) return { success: true };
  } catch (error) {}

  const requests = getLocalRequests();
  const filtered = requests.filter(r => String(r.id) !== String(requestId));
  saveLocalRequests(filtered);
  return { success: true };
};

// ==================== UPLOAD IMAGE FUNCTIONS ====================

export const uploadTokoImage = async (file, tokoId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `toko_${tokoId}_${Date.now()}.${fileExt}`;
    const filePath = `toko-images/${fileName}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (!error) {
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return { success: true, url: publicUrl, path: filePath };
    }
  } catch (error) {}

  // Fallback: create object URL
  const dummyUrl = URL.createObjectURL(file);
  return { success: true, url: dummyUrl, path: file.name };
};

export const deleteTokoImage = async (imagePath) => {
  try {
    await supabase.storage.from('images').remove([imagePath]);
  } catch (error) {}
  return { success: true };
};

// ==================== SEARCH & FILTER FUNCTIONS ====================

export const searchToko = async (query) => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .select('*')
      .ilike('nama', `%${query}%`);

    if (!error && data) return { success: true, data: data.map(normalizeToko) };
  } catch (error) {}

  const tokos = getLocalTokos();
  const filtered = tokos.filter(t => t.nama.toLowerCase().includes(query.toLowerCase()));
  return { success: true, data: filtered };
};

export const filterByKecamatan = async (kecamatan) => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .select('*')
      .eq('kecamatan', kecamatan);

    if (!error && data) return { success: true, data: data.map(normalizeToko) };
  } catch (error) {}

  const tokos = getLocalTokos();
  const filtered = tokos.filter(t => t.kecamatan?.toLowerCase() === kecamatan.toLowerCase());
  return { success: true, data: filtered };
};

export const filterByProduk = async (produk) => {
  try {
    const { data, error } = await supabase
      .from('toko_kue')
      .select('*')
      .eq('produk', produk);

    if (!error && data) return { success: true, data: data.map(normalizeToko) };
  } catch (error) {}

  const tokos = getLocalTokos();
  const filtered = tokos.filter(t => t.produk?.toLowerCase() === produk.toLowerCase());
  return { success: true, data: filtered };
};

// ==================== LOG HISTORY FUNCTIONS ====================

export const addLog = async (logData) => {
  try {
    const logPayload = {
      user_email: logData.userEmail || logData.user_email,
      user_role: logData.userRole || logData.user_role || null,
      action: logData.action,
      toko_id: logData.tokoId || logData.toko_id || null,
      toko_name: logData.tokoName || logData.toko_name || null,
      description: logData.description || null,
      timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('log_history')
      .insert([logPayload])
      .select();

    if (!error && data && data.length > 0) {
      return { success: true, data: data[0] };
    }
  } catch (error) {}

  const logs = getLocalLogs();
  const newLog = {
    id: Date.now(),
    user_email: logData.userEmail || logData.user_email,
    user_role: logData.userRole || logData.user_role || null,
    action: logData.action,
    toko_id: logData.tokoId || logData.toko_id || null,
    toko_name: logData.tokoName || logData.toko_name || null,
    description: logData.description || null,
    timestamp: new Date().toISOString()
  };
  logs.unshift(newLog);
  saveLocalLogs(logs);
  return { success: true, data: newLog };
};

export const getAllLogs = async () => {
  try {
    const { data, error } = await supabase
      .from('log_history')
      .select('*')
      .order('timestamp', { ascending: false });

    if (!error && data) return { success: true, data };
  } catch (error) {}

  return { success: true, data: getLocalLogs() };
};

export const getLogsByUserEmail = async (userEmail) => {
  try {
    const { data, error } = await supabase
      .from('log_history')
      .select('*')
      .eq('user_email', userEmail)
      .order('timestamp', { ascending: false });

    if (!error && data) return { success: true, data };
  } catch (error) {}

  const logs = getLocalLogs();
  const filtered = logs.filter(l => l.user_email?.toLowerCase() === userEmail.toLowerCase());
  return { success: true, data: filtered };
};

export default supabase;