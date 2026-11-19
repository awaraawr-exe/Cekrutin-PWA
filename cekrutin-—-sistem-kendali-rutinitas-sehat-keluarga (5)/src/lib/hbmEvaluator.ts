import {GlucoseType, HbmStatus, HealthCheckRecord} from '../types/health';

export const PROMOTIVE_DISCLAIMER =
  'Disclaimer Promotif-Preventif: Hasil evaluasi ini merupakan skrining mandiri berbasis indikator edukasi kesehatan untuk membantu deteksi dini keluarga, bukan diagnosis medis pengganti pemeriksaan dokter. Apabila ditemukan hasil Waspada atau Perlu Konsultasi Puskesmas, segera lakukan pemeriksaan lanjutan ke Puskesmas atau Fasilitas Kesehatan Tingkat Pertama (FKTP) terdekat.';

export interface MetricEvaluation {
  status: HbmStatus;
  statusLabel: string;
  detailLabel: string;
  recommendation: string;
}

export interface FullHealthEvaluation {
  bloodPressure: MetricEvaluation;
  glucose: MetricEvaluation;
  cholesterol: MetricEvaluation;
  bmi: MetricEvaluation;
  bmiValue: number;
  overallStatus: HbmStatus;
  overallLabel: string;
  needsPuskesmasReferral: boolean;
  summaryRecommendation: string;
}

export function calculateBmi(weightKg: number, heightCm: number): number {
  if (weightKg <= 0 || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

export function getStatusLabel(status: HbmStatus): string {
  switch (status) {
    case 'normal':
      return 'Normal';
    case 'waspada':
      return 'Waspada';
    case 'konsultasi':
      return 'Perlu Konsultasi Puskesmas';
  }
}

export function evaluateBloodPressure(systolic: number, diastolic: number): MetricEvaluation {
  if (systolic < 90 || diastolic < 60) {
    return {
      status: 'konsultasi',
      statusLabel: 'Perlu Konsultasi Puskesmas',
      detailLabel: 'Tekanan darah rendah (Hipotensi)',
      recommendation:
        'Pastikan asupan cairan tercukupi dan hindari berdiri mendadak. Segera konsultasi ke Puskesmas bila disertai pusing atau lemas.',
    };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return {
      status: 'konsultasi',
      statusLabel: 'Perlu Konsultasi Puskesmas',
      detailLabel: 'Tinggi (Indikasi Hipertensi)',
      recommendation:
        'Kurangi konsumsi garam (<1 sendok teh/hari), kelola stres, dan jadwalkan pemeriksaan tekanan darah ulang di Puskesmas dalam 1–3 hari.',
    };
  }
  if (systolic >= 120 || diastolic >= 80) {
    return {
      status: 'waspada',
      statusLabel: 'Waspada',
      detailLabel: 'Pra-hipertensi (Perbatasan)',
      recommendation:
        'Batasi makanan tinggi natrium, perbanyak sayur dan buah sumber kalium, serta lakukan aktivitas fisik mikro minimal 15 menit per hari.',
    };
  }
  return {
    status: 'normal',
    statusLabel: 'Normal',
    detailLabel: 'Optimal (<120/80 mmHg)',
    recommendation: 'Pertahankan pola makan seimbang, hidrasi cukup, dan cek rutin tiap bulan.',
  };
}

export function evaluateGlucose(glucose: number, type: GlucoseType): MetricEvaluation {
  if (glucose < 70) {
    return {
      status: 'konsultasi',
      statusLabel: 'Perlu Konsultasi Puskesmas',
      detailLabel: 'Terlalu rendah (Hipoglikemia)',
      recommendation:
        'Segera konsumsi asupan karbohidrat cepat serap bila lemas dan konsultasikan kondisi ini ke petugas kesehatan di Puskesmas.',
    };
  }
  if (type === 'puasa') {
    if (glucose >= 126) {
      return {
        status: 'konsultasi',
        statusLabel: 'Perlu Konsultasi Puskesmas',
        detailLabel: 'Tinggi (Puasa ≥126 mg/dL)',
        recommendation:
          'Perlu konfirmasi pemeriksaan gula darah vena di Puskesmas. Hindari minuman manis kemasan dan atur porsi karbohidrat kompleks.',
      };
    }
    if (glucose >= 100) {
      return {
        status: 'waspada',
        statusLabel: 'Waspada',
        detailLabel: 'Prediabetes (Puasa 100–125 mg/dL)',
        recommendation:
          'Kurangi gula tambahan harian (maksimal 4 sendok makan/hari) dan rutin jalan kaki 10–15 menit setelah makan.',
      };
    }
    return {
      status: 'normal',
      statusLabel: 'Normal',
      detailLabel: 'Normal Puasa (70–99 mg/dL)',
      recommendation: 'Kadar gula darah puasa terjaga baik. Lanjutkan pola Isi Piringku.',
    };
  }

  // Sewaktu
  if (glucose >= 200) {
    return {
      status: 'konsultasi',
      statusLabel: 'Perlu Konsultasi Puskesmas',
      detailLabel: 'Tinggi (Sewaktu ≥200 mg/dL)',
      recommendation:
        'Segera jadwalkan pemeriksaan gula darah puasa dan HbA1c di Puskesmas atau Posbindu PTM terdekat.',
    };
  }
  if (glucose >= 140) {
    return {
      status: 'waspada',
      statusLabel: 'Waspada',
      detailLabel: 'Perbatasan (Sewaktu 140–199 mg/dL)',
      recommendation:
        'Perhatikan jarak waktu makan terakhir, perbanyak serat sayur, dan evaluasi ulang dengan cek gula darah puasa.',
    };
  }
  return {
    status: 'normal',
    statusLabel: 'Normal',
    detailLabel: 'Normal Sewaktu (<140 mg/dL)',
    recommendation: 'Kadar gula darah sewaktu berada pada rentang aman.',
  };
}

export function evaluateCholesterol(cholesterol: number): MetricEvaluation {
  if (cholesterol >= 240) {
    return {
      status: 'konsultasi',
      statusLabel: 'Perlu Konsultasi Puskesmas',
      detailLabel: 'Tinggi (≥240 mg/dL)',
      recommendation:
        'Batasi gorengan, santan kental, dan jeroan. Konsultasikan profil lipid lengkap ke Puskesmas.',
    };
  }
  if (cholesterol >= 200) {
    return {
      status: 'waspada',
      statusLabel: 'Waspada',
      detailLabel: 'Batas Tinggi (200–239 mg/dL)',
      recommendation:
        'Tingkatkan asupan serat larut dari buah, sayur, serta ikan berlemak sehat dan kurangi lemak jenuh.',
    };
  }
  return {
    status: 'normal',
    statusLabel: 'Normal',
    detailLabel: 'Optimal (<200 mg/dL)',
    recommendation: 'Kadar kolesterol total baik. Teruskan pola masak kukus, rebus, atau panggang.',
  };
}

export function evaluateBmi(bmi: number): MetricEvaluation {
  if (bmi <= 0) {
    return {
      status: 'waspada',
      statusLabel: 'Waspada',
      detailLabel: 'Data belum valid',
      recommendation: 'Pastikan berat dan tinggi badan diisi dengan benar.',
    };
  }
  if (bmi < 17.0) {
    return {
      status: 'konsultasi',
      statusLabel: 'Perlu Konsultasi Puskesmas',
      detailLabel: 'Kurus Berat (<17.0 kg/m²)',
      recommendation:
        'Perlu evaluasi status gizi dan kecukupan protein harian bersama ahli gizi Puskesmas.',
    };
  }
  if (bmi < 18.5) {
    return {
      status: 'waspada',
      statusLabel: 'Waspada',
      detailLabel: 'Kurus Ringan (17.0–18.4 kg/m²)',
      recommendation: 'Tingkatkan asupan gizi seimbang tinggi protein nabati/hewani dan karbohidrat sehat.',
    };
  }
  if (bmi <= 25.0) {
    return {
      status: 'normal',
      statusLabel: 'Normal',
      detailLabel: 'Normal Kemenkes (18.5–25.0 kg/m²)',
      recommendation: 'Berat badan ideal sesuai standar Kemenkes RI. Pertahankan aktivitas fisik rutin.',
    };
  }
  if (bmi <= 27.0) {
    return {
      status: 'waspada',
      statusLabel: 'Waspada',
      detailLabel: 'Gemuk Ringan (25.1–27.0 kg/m²)',
      recommendation:
        'Lakukan aktivitas fisik mikro 15 menit setiap hari dan kurangi porsi camilan tinggi gula/minyak.',
    };
  }
  return {
    status: 'konsultasi',
    statusLabel: 'Perlu Konsultasi Puskesmas',
    detailLabel: 'Obesitas (>27.0 kg/m²)',
    recommendation:
      'Tingkatkan aktivitas fisik bertahap dan manfaatkan layanan konseling gizi di Puskesmas atau Posbindu PTM.',
  };
}

export function evaluateFullHealthCheck(
  record: Pick<
    HealthCheckRecord,
    'systolic' | 'diastolic' | 'glucose' | 'glucoseType' | 'cholesterol' | 'weightKg' | 'heightCm'
  >,
): FullHealthEvaluation {
  const bmiValue = calculateBmi(record.weightKg, record.heightCm);
  const bloodPressure = evaluateBloodPressure(record.systolic, record.diastolic);
  const glucose = evaluateGlucose(record.glucose, record.glucoseType);
  const cholesterol = evaluateCholesterol(record.cholesterol);
  const bmi = evaluateBmi(bmiValue);

  const statuses = [bloodPressure.status, glucose.status, cholesterol.status, bmi.status];
  let overallStatus: HbmStatus = 'normal';
  if (statuses.includes('konsultasi')) {
    overallStatus = 'konsultasi';
  } else if (statuses.includes('waspada')) {
    overallStatus = 'waspada';
  }

  const needsPuskesmasReferral = overallStatus !== 'normal';

  let summaryRecommendation =
    'Seluruh indikator pemeriksaan berada dalam batas normal. Pertahankan rutinitas minum air, makan buah-sayur, dan aktivitas mikro harian.';

  if (overallStatus === 'waspada') {
    summaryRecommendation =
      'Terdapat satu atau lebih parameter dalam zona Waspada. Perkuat kebiasaan sehat harian dalam 2 minggu ke depan dan pantau ulang di Posbindu PTM atau Puskesmas.';
  } else if (overallStatus === 'konsultasi') {
    summaryRecommendation =
      'Terdeteksi indikator yang memerlukan perhatian medis. Segera jadwalkan kunjungan konsultasi ke Puskesmas terdekat dengan membawa catatan riwayat CEKRutin ini.';
  }

  return {
    bloodPressure,
    glucose,
    cholesterol,
    bmi,
    bmiValue,
    overallStatus,
    overallLabel: getStatusLabel(overallStatus),
    needsPuskesmasReferral,
    summaryRecommendation,
  };
}
