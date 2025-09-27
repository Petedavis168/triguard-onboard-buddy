import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Download, 
  ArrowLeft,
  Calendar,
  CheckCircle,
  Star,
  Trophy,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Certificate {
  id: string;
  title: string;
  description: string;
  issued_date: string;
  expiry_date?: string;
  course_name: string;
  score: number;
  certificate_url?: string;
  status: 'active' | 'expired' | 'pending';
  category: string;
}

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      // Mock data for demonstration
      const mockCertificates: Certificate[] = [
        {
          id: '1',
          title: 'Basic Safety Training Certificate',
          description: 'Completed comprehensive safety training program',
          issued_date: '2025-09-20',
          expiry_date: '2026-09-20',
          course_name: 'Basic Safety Training',
          score: 92,
          status: 'active',
          category: 'Safety',
          certificate_url: '#'
        },
        {
          id: '2',
          title: 'Equipment Knowledge Certification',
          description: 'Demonstrated proficiency in equipment usage and maintenance',
          issued_date: '2025-09-15',
          expiry_date: '2027-09-15',
          course_name: 'Equipment Knowledge Test',
          score: 88,
          status: 'active',
          category: 'Technical',
          certificate_url: '#'
        },
        {
          id: '3',
          title: 'Customer Service Excellence',
          description: 'Achieved excellence in customer service practices',
          issued_date: '2025-08-30',
          course_name: 'Customer Service Training',
          score: 95,
          status: 'active',
          category: 'Soft Skills',
          certificate_url: '#'
        },
        {
          id: '4',
          title: 'Advanced Roofing Techniques',
          description: 'Mastered advanced roofing installation techniques',
          issued_date: '2024-12-15',
          expiry_date: '2025-12-15',
          course_name: 'Advanced Roofing Course',
          score: 87,
          status: 'expired',
          category: 'Technical',
          certificate_url: '#'
        }
      ];

      setCertificates(mockCertificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast({
        title: "Error",
        description: "Failed to load certificates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'safety': return 'bg-red-100 text-red-800';
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'soft skills': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleDownload = (certificate: Certificate) => {
    toast({
      title: "Downloading Certificate",
      description: `Preparing ${certificate.title} for download...`,
    });
    
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Certificate has been downloaded successfully",
      });
    }, 1500);
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    return expiry <= thirtyDaysFromNow && expiry > now;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading certificates...</p>
        </div>
      </div>
    );
  }

  const activeCertificates = certificates.filter(c => c.status === 'active');
  const expiredCertificates = certificates.filter(c => c.status === 'expired');
  const averageScore = certificates.reduce((sum, cert) => sum + cert.score, 0) / certificates.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/user-dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
                <p className="text-muted-foreground mt-1">View and download your earned certificates</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                {certificates.length} Certificates
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-green-700">{activeCertificates.length}</p>
                  <p className="text-sm text-green-600">Active</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-red-700">{expiredCertificates.length}</p>
                  <p className="text-sm text-red-600">Expired</p>
                </div>
                <Calendar className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-yellow-700">
                    {certificates.filter(c => isExpiringSoon(c.expiry_date)).length}
                  </p>
                  <p className="text-sm text-yellow-600">Expiring Soon</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-blue-700">{Math.round(averageScore)}%</p>
                  <p className="text-sm text-blue-600">Avg Score</p>
                </div>
                <Star className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      {certificate.title}
                    </CardTitle>
                    <CardDescription className="text-sm mb-3">
                      {certificate.description}
                    </CardDescription>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={`text-xs ${getStatusColor(certificate.status)}`}>
                        {certificate.status}
                      </Badge>
                      <Badge className={`text-xs ${getCategoryColor(certificate.category)}`}>
                        {certificate.category}
                      </Badge>
                      {isExpiringSoon(certificate.expiry_date) && (
                        <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200">
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Course:</span>
                    <span className="font-medium">{certificate.course_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Score:</span>
                    <span className={`font-medium ${getScoreColor(certificate.score)}`}>
                      {certificate.score}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issued:</span>
                    <span>{new Date(certificate.issued_date).toLocaleDateString()}</span>
                  </div>
                  {certificate.expiry_date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires:</span>
                      <span className={certificate.status === 'expired' ? 'text-red-600' : ''}>
                        {new Date(certificate.expiry_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleDownload(certificate)}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {certificates.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No certificates yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete courses and quizzes to earn certificates
              </p>
              <Link to="/courses">
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Browse Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Certificates;