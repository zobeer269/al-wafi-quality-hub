
// Fix the role comparison issue
const checkUserRoles = async () => {
  try {
    const { data } = await supabase.rpc('is_qa_or_admin');
    setIsQAOrAdmin(data || false);
    
    const { data: userData } = await supabase.auth.getUser();
    setCurrentUser(userData.user);
    
    // Get roles
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user?.id);
      
    if (rolesError) throw rolesError;
    
    if (rolesData) {
      const userRoles = rolesData.map(r => r.role);
      // Check if user has any role that can review
      const canReview = userRoles.some(role => 
        ['admin', 'qa', 'manager'].includes(role)
      );
      setCanReview(canReview);
    }
  } catch (error) {
    console.error('Error checking roles:', error);
  }
};
